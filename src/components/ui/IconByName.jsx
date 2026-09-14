import { Building2, Clock3, MapPin, MessageCircle, Phone, Tags } from 'lucide-react';

export function IconByName({ name, size = 26 }) {
  const icons = {
    building: Building2,
    clock: Clock3,
    map: MapPin,
    phone: Phone,
    tags: Tags,
    whatsapp: MessageCircle,
  };
  const Icon = icons[name] || MessageCircle;
  return <Icon size={size} />;
}