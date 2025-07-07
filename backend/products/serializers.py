from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import FrameType ,Category, Accessory, Product 
from django.conf import settings
from django.core.files.storage import default_storage
import os
from .models import Review
User = get_user_model()

# serializers.py
class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.name', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'rating', 'title', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at'] 
        
    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
class FrameTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrameType
        fields = ['id', 'name', 'description' ,'created_at']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description' ,'created_at']        


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    frame_type = FrameTypeSerializer(read_only=True)
    frame_type_id = serializers.PrimaryKeyRelatedField(
        queryset=FrameType.objects.all(),
        source='frame_type',
        write_only=True,
        required=False,
        allow_null=True
    )
    images = serializers.ListField(
        child=serializers.ImageField(max_length=100000, allow_empty_file=False),
        write_only=True,
        required=False
    )

   
    class Meta:
        model = Product
        fields = '__all__'
        extra_kwargs = {
            'category': {'required': False},
            'frame_type': {'required': False},
        }

    def validate(self, data):
        # If category is accessory, ensure frame_type is None
        category = data.get('category')
        frame_type = data.get('frame_type')
        
        if category and category.name.lower() == 'accessory' and frame_type:
            raise serializers.ValidationError({
                'frame_type_id': 'Accessories should not have a frame type'
            })
            
        return data
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get('request')

        if hasattr(instance, 'images'):
            rep['images'] = instance.images or [] 
            
        for field in ['features', 'face_shapes', 'vision_problems', 'colors']:
            if rep.get(field) is None:
                rep[field] = []
        
        if 'images' in rep and rep['images']:
            rep['images'] = [
                request.build_absolute_uri(settings.MEDIA_URL + image) 
                for image in rep['images']
            ]
        
        return rep
    
    def create(self, validated_data):
        uploaded_images = validated_data.pop('images', [])
        product = super().create(validated_data)

        image_paths = []
        for image in uploaded_images:
            file_path = f'products/{product.id}/{image.name}'
            saved_path = default_storage.save(file_path, image)
            image_paths.append(saved_path)
           
        product.images = image_paths
        product.save()
        return product
    
    existing_images = serializers.CharField(write_only=True, required=False)

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('images', [])
        existing_images_json = validated_data.pop('existing_images', '[]')

        try:
            existing_images = set(eval(existing_images_json))
        except:
            existing_images = set()

        # Delete old images not in the current list
        old_images = set(instance.images or [])
        images_to_keep = old_images & existing_images
        images_to_delete = old_images - images_to_keep

        for image_path in images_to_delete:
            full_path = os.path.join(settings.MEDIA_ROOT, image_path)
            if default_storage.exists(image_path):
                default_storage.delete(image_path)

        # Add newly uploaded images
        new_image_paths = []
        for image in uploaded_images:
            file_path = f'products/{instance.id}/{image.name}'
            saved_path = default_storage.save(file_path, image)
            new_image_paths.append(saved_path)

        # Combine kept + newly added
        instance.images = list(images_to_keep) + new_image_paths

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
    
    
class AccessorySerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    # manufacturer = serializers.PrimaryKeyRelatedField(
    #     queryset=User.objects.filter(role='manufacturer')
    # )
    
    class Meta:
        model = Accessory
        fields = [
            'id', 'name', 'description', 'category', 'category_id',
            'price', 'stock', 'image', 'weight', 'manufacturer',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['manufacturer', 'created_at', 'updated_at']

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative.")
        return value
