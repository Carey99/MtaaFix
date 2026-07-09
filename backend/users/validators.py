import re
from django.core.exceptions import ValidationError


class StrongPasswordValidator:
    
    def validate(self, password, user=None):
        errors = []
        if not re.search(r'[A-Z]', password):
            errors.append('one uppercase letter')
        if not re.search(r'[a-z]', password):
            errors.append('one lowercase letter')
        if not re.search(r'\d', password):
            errors.append('one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>_\-]', password):
            errors.append('one special character')
        if errors:
            raise ValidationError(f"Password needs: {', '.join(errors)}")
        
    def get_help_text(self):
        return 'Must have uppercase, lowercase, number, and special character.'