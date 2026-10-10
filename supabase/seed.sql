-- ============================================================================
-- SignBridge AI - PostgreSQL / Supabase Seed Script
-- ============================================================================

-- Insert Demo Profile
INSERT INTO profiles (id, display_name, avatar_url, preferred_sign_language, reduced_motion, high_contrast)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Alex Chen (Demo Communicator)',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'ASL',
  FALSE,
  FALSE
) ON CONFLICT (id) DO NOTHING;

-- Insert Seed Conversation
INSERT INTO conversations (id, user_id, title, is_pinned, last_message_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001',
  'Sign Language Introduction & Live Test',
  TRUE,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert Messages
INSERT INTO messages (id, conversation_id, user_id, role, content, input_modality, status)
VALUES
(
  '22222222-2222-2222-2222-222222222221',
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001',
  'user',
  'Hello! I am testing this platform with American Sign Language video.',
  'video',
  'completed'
),
(
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'assistant',
  'Welcome! Your sign language input was clearly recognized with **95.4% confidence** in ASL. How may I assist your communication today?',
  'text',
  'completed'
) ON CONFLICT (id) DO NOTHING;
