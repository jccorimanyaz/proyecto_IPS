from django.db import models

class Pool(models.Model):
    STATE_CHOICES = [
        ('RES_EXPIRED', 'Resolution Expired'),
        ('RES_VALID', 'Resolution Valid'),
    ]

    CURRENT_STATE_CHOICES = [
        ('HEALTHY', 'Healthy'),
        ('UNHEALTHY', 'Unhealthy'),
    ]

    file_number = models.CharField("File Number", max_length=50, unique=True)
    legal_name = models.CharField("Legal Name / Owner", max_length=255)
    commercial_name = models.CharField("Commercial Name", max_length=255, blank=True, null=True)
    pool_type = models.CharField("Type", max_length=50)
    address = models.TextField("Address")
    district = models.CharField("District", max_length=100)
    capacity = models.PositiveIntegerField("Capacity")
    area_m2 = models.DecimalField("Area (m²)", max_digits=10, decimal_places=2)
    volume_m3 = models.DecimalField("Volume (m³)", max_digits=10, decimal_places=2)
    approval_resolution_number = models.CharField("Approval Resolution Number", max_length=100, blank=True, null=True)
    approval_date = models.DateField("Approval Date", blank=True, null=True)
    state = models.CharField("State", max_length=20, choices=STATE_CHOICES, default='RES_VALID')
    observations = models.TextField("Observations", blank=True, null=True)
    expiration_date = models.DateField("Expires On", blank=True, null=True)
    last_inspection_date = models.DateField("Last Inspection Date", blank=True, null=True)
    current_state = models.CharField("Current State", max_length=20, choices=CURRENT_STATE_CHOICES, default='HEALTHY')

    latitude = models.DecimalField("Latitude", max_digits=12, decimal_places=9, blank=True, null=True)
    longitude = models.DecimalField("Longitude", max_digits=12, decimal_places=9, blank=True, null=True)
    image_url = models.URLField("Image URL", blank=True, null=True)
    rating = models.DecimalField("Rating (1-5)", max_digits=2, decimal_places=1, blank=True, null=True)
    
    class Meta:
        verbose_name = "Pool"
        verbose_name_plural = "Pools"
        db_table = "pools"

    def __str__(self):
        return f"{self.file_number} - {self.commercial_name or self.legal_name}"