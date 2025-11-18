import React from 'react';
import {
  Bell,
  Pill,
  Calendar,
  MapPin,
  Phone,
  Scissors,
  Utensils,
  Hospital,
  Sparkles,
  Car,
  Gift,
  Mic,
  Star,
  Home,
  Search,
  CalendarCheck,
  User,
  Eye,
  Heart,
  ArrowLeft,
  MessageCircle,
  Clock,
  FileText,
  Send,
  Droplet,
  Activity,
  Plus,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  X,
  AlertCircle,
  Info,
} from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export default function Icon({ name, size = 24, color = 'currentColor', className = '' }: IconProps) {
  const iconProps = {
    size,
    color,
    className,
    strokeWidth: 2,
  };

  const icons: Record<string, React.ReactElement> = {
    bell: <Bell {...iconProps} />,
    pill: <Pill {...iconProps} />,
    calendar: <Calendar {...iconProps} />,
    mapPin: <MapPin {...iconProps} />,
    phone: <Phone {...iconProps} />,
    scissors: <Scissors {...iconProps} />,
    utensils: <Utensils {...iconProps} />,
    hospital: <Hospital {...iconProps} />,
    sparkles: <Sparkles {...iconProps} />,
    car: <Car {...iconProps} />,
    gift: <Gift {...iconProps} />,
    mic: <Mic {...iconProps} />,
    star: <Star {...iconProps} />,
    home: <Home {...iconProps} />,
    search: <Search {...iconProps} />,
    calendarCheck: <CalendarCheck {...iconProps} />,
    user: <User {...iconProps} />,
    wave: <Eye {...iconProps} />,
    heart: <Heart {...iconProps} />,
    arrowLeft: <ArrowLeft {...iconProps} />,
    messageCircle: <MessageCircle {...iconProps} />,
    clock: <Clock {...iconProps} />,
    fileText: <FileText {...iconProps} />,
    send: <Send {...iconProps} />,
    droplet: <Droplet {...iconProps} />,
    activity: <Activity {...iconProps} />,
    plus: <Plus {...iconProps} />,
    chevronRight: <ChevronRight {...iconProps} />,
    trendingUp: <TrendingUp {...iconProps} />,
    trendingDown: <TrendingDown {...iconProps} />,
    minus: <Minus {...iconProps} />,
    check: <Check {...iconProps} />,
    x: <X {...iconProps} />,
    alertCircle: <AlertCircle {...iconProps} />,
    info: <Info {...iconProps} />,
  };

  return icons[name] || null;
}
