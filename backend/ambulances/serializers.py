from rest_framework import serializers
from .models import Ambulance, AmbulanceRequest, Dispatch, DispatchLog
from users.serializers import UserSerializer

class AmbulanceSerializer(serializers.ModelSerializer):
    current_driver = UserSerializer(read_only=True)
    
    class Meta:
        model = Ambulance
        fields = '__all__'

class AmbulanceRequestSerializer(serializers.ModelSerializer):
    requested_by_name = serializers.CharField(source='requested_by.full_name', read_only=True)

    class Meta:
        model = AmbulanceRequest
        fields = '__all__'

class DispatchLogSerializer(serializers.ModelSerializer):
    performed_by_name = serializers.CharField(source='performed_by.full_name', read_only=True)

    class Meta:
        model = DispatchLog
        fields = '__all__'

class DispatchSerializer(serializers.ModelSerializer):
    ambulance_details = AmbulanceSerializer(source='ambulance', read_only=True)
    request_details = AmbulanceRequestSerializer(source='request', read_only=True)
    logs = DispatchLogSerializer(many=True, read_only=True)

    class Meta:
        model = Dispatch
        fields = '__all__'
