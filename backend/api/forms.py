from django import forms
from django.contrib.auth.models import User, Group


class CustomUserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email", "groups"]
    
    def __init__(self, *args, **kwargs):
        super(CustomUserForm, self).__init__(*args, **kwargs)
        self.fields['groups'].queryset = Group.objects.filter(name="admin")