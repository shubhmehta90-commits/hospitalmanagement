from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Ambulance, AmbulanceRequest, Dispatch, DispatchLog
from .serializers import (
    AmbulanceSerializer, AmbulanceRequestSerializer, 
    DispatchSerializer, DispatchLogSerializer
)

class AmbulanceViewSet(viewsets.ModelViewSet):
    queryset = Ambulance.objects.all()
    serializer_class = AmbulanceSerializer

class AmbulanceRequestViewSet(viewsets.ModelViewSet):
    queryset = AmbulanceRequest.objects.all().order_by('-created_at')
    serializer_class = AmbulanceRequestSerializer

    @action(detail=True, methods=['post'])
    def dispatch(self, request, pk=None):
        ambulance_request = self.get_object()
        ambulance_id = request.data.get('ambulance_id')
        
        try:
            ambulance = Ambulance.objects.get(id=ambulance_id)
        except Ambulance.DoesNotExist:
            return Response({'error': 'Ambulance not found'}, status=status.HTTP_404_NOT_FOUND)

        if ambulance.status != Ambulance.Status.AVAILABLE:
            return Response({'error': 'Ambulance is not available'}, status=status.HTTP_400_BAD_CONTENT)

        # Create Dispatch
        dispatch = Dispatch.objects.create(
            ambulance=ambulance,
            request=ambulance_request,
            status=Dispatch.Status.PENDING
        )

        # Update Request Status
        ambulance_request.status = AmbulanceRequest.Status.ASSIGNED
        ambulance_request.save()

        # Update Ambulance Status
        ambulance.status = Ambulance.Status.BUSY
        ambulance.save()

        # Audit Log
        DispatchLog.objects.create(
            dispatch=dispatch,
            action='ASSIGNED',
            performed_by=request.user,
            notes=f"Assigned ambulance {ambulance.vehicle_number}"
        )

        return Response(DispatchSerializer(dispatch).data)

class DispatchViewSet(viewsets.ModelViewSet):
    queryset = Dispatch.objects.all().order_by('-assigned_time')
    serializer_class = DispatchSerializer

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        dispatch = self.get_object()
        
        # In a real app, verify request.user is the assigned driver
        dispatch.status = Dispatch.Status.ACCEPTED
        dispatch.accepted_time = timezone.now()
        dispatch.save()

        # Update request
        dispatch.request.status = AmbulanceRequest.Status.IN_PROGRESS
        dispatch.request.save()

        DispatchLog.objects.create(
            dispatch=dispatch,
            action='ACCEPTED',
            performed_by=request.user
        )

        return Response(DispatchSerializer(dispatch).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        dispatch = self.get_object()
        reason = request.data.get('reason', '')
        
        dispatch.status = Dispatch.Status.REJECTED
        dispatch.driver_response = reason
        dispatch.save()

        # Revert ambulance/request status
        dispatch.ambulance.status = Ambulance.Status.AVAILABLE
        dispatch.ambulance.save()

        dispatch.request.status = AmbulanceRequest.Status.PENDING
        dispatch.request.save()

        DispatchLog.objects.create(
            dispatch=dispatch,
            action='REJECTED',
            performed_by=request.user,
            notes=reason
        )

        return Response(DispatchSerializer(dispatch).data)

    @action(detail=True, methods=['post'])
    def confirm_arrival(self, request, pk=None):
        dispatch = self.get_object()
        dispatch.status = Dispatch.Status.ARRIVED
        dispatch.arrival_time = timezone.now()
        dispatch.save()

        DispatchLog.objects.create(
            dispatch=dispatch,
            action='ARRIVED',
            performed_by=request.user
        )

        return Response(DispatchSerializer(dispatch).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        dispatch = self.get_object()
        dispatch.status = Dispatch.Status.COMPLETED
        dispatch.completion_time = timezone.now()
        dispatch.save()

        # Update Ambulance
        dispatch.ambulance.status = Ambulance.Status.AVAILABLE
        dispatch.ambulance.save()

        # Update Request
        dispatch.request.status = AmbulanceRequest.Status.COMPLETED
        dispatch.request.save()

        DispatchLog.objects.create(
            dispatch=dispatch,
            action='COMPLETED',
            performed_by=request.user
        )

        return Response(DispatchSerializer(dispatch).data)
