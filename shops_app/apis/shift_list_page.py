# # -*- coding: utf-8 -*-
from django.utils import timezone

from rest_framework import generics, serializers, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django_filters import rest_framework as filters

from stock.models import LumberRecord
from stock_operations.models import Shift


class ShiftListView(generics.ListAPIView):

    class ShiftReadSerializer(serializers.ModelSerializer):

        class LumberRecordSerializer(serializers.ModelSerializer):
            lumber = serializers.StringRelatedField()
            wood_species = serializers.ReadOnlyField(source='lumber.wood_species')

            class Meta:
                model = LumberRecord
                fields = ('lumber', 'quantity', 'volume', 'rate', 'total_cash', 'back_total_cash',
                 'wood_species',)

        lumber_records = LumberRecordSerializer(many=True)
        employees = serializers.StringRelatedField(read_only=True, many=True)
        date = serializers.DateTimeField(format='%d/%m', read_only=True)
        volume_without_zabor = serializers.ReadOnlyField()

        class Meta:
            model = Shift
            fields = '__all__'


    class ShiftFilter(filters.FilterSet):
        date = filters.DateFromToRangeFilter()

        class Meta:
            model = Shift
            fields = ['shop', 'date']


    class CanSeeShopShiftPermissions(permissions.BasePermission):
        def has_permission(self, request, view):
            if request.method in permissions.SAFE_METHODS:
                if request.GET.get('shop') and \
                    (int(request.GET.get('shop')) == request.user.account.shop.pk):
                    return True
            return False

    queryset = Shift.objects.all().prefetch_related('lumber_records')
    serializer_class = ShiftReadSerializer
    permission_classes = [IsAuthenticated, CanSeeShopShiftPermissions ]
    filter_class = ShiftFilter


class DeleteShiftView(generics.DestroyAPIView):

    class ShiftReadSerializer(serializers.ModelSerializer):

        class LumberRecordSerializer(serializers.ModelSerializer):
            lumber = serializers.StringRelatedField()
            wood_species = serializers.ReadOnlyField(source='lumber.wood_species')

            class Meta:
                model = LumberRecord
                fields = ('lumber', 'quantity', 'volume', 'rate', 'total_cash', 'back_total_cash',
                 'wood_species')

        lumber_records = LumberRecordSerializer(many=True)
        employees = serializers.StringRelatedField(read_only=True, many=True)
        date = serializers.DateTimeField(format='%d/%m', read_only=True)

        class Meta:
            model = Shift
            fields = '__all__'


    class DeletePermissions(permissions.BasePermission):
        def has_permission(self, request, view):
            if request.method == 'DELETE':
                return True

            return False

        def has_object_permission(self, request, view, obj):
            if request.method == 'DELETE':
                return request.user.account.shop == obj.shop

            return False

    permission_classes = [IsAuthenticated, DeletePermissions ]

    def destroy(self, request, pk=None):
        Shift.objects.get(pk=pk).delete()
        return Response({
            'shifts': self.ShiftReadSerializer(
                    Shift.objects.filter(shop=request.user.account.shop,
                     created_at__date__gte=timezone.now().date()), many=True).data,
            },
            status=status.HTTP_200_OK)