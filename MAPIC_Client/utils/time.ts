/**
 * Time Formatting Utilities
 */

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  
  if (diffMinutes < 1) {
    return 'Vừa xong';
  }
  
  if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  }
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  }
  
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) {
    return `${diffWeeks} tuần trước`;
  }
  
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} tháng trước`;
}

export function calculateStatus(lastSeenString: string): 'ONLINE' | 'AWAY' | 'OFFLINE' {
  const lastSeen = new Date(lastSeenString);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / 60000);
  
  if (diffMinutes < 5) {
    return 'ONLINE';
  }
  
  if (diffMinutes < 30) {
    return 'AWAY';
  }
  
  return 'OFFLINE';
}
