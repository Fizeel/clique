export type Plan = 'standard'
export type MediaType = 'image' | 'video'
export type EventType =
  | 'wedding'
  | 'birthday'
  | 'graduation'
  | 'baby_shower'
  | 'anniversary'
  | 'corporate'
  | 'other'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  plan: Plan
  is_active: boolean
  created_at: string
}

export interface AppEvent {
  id: string
  user_id: string
  slug: string
  name: string
  event_type: EventType
  event_date: string | null
  cover_image_url: string | null
  custom_message: string | null
  is_active: boolean
  allow_videos: boolean
  max_file_size_mb: number
  max_videos: number
  photo_count: number
  video_count: number
  expires_at: string
  created_at: string
}

export interface Media {
  id: string
  event_id: string
  storage_key: string
  file_url: string
  file_type: MediaType
  file_size_bytes: number
  mime_type: string
  width: number | null
  height: number | null
  duration_seconds: number | null
  guest_name: string | null
  is_approved: boolean
  created_at: string
}
