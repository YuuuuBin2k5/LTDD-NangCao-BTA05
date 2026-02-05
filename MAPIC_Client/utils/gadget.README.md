# Gadget Selection Logic

This module provides functions to determine which Doraemon gadget should be displayed for a user's avatar based on their speed, status, and weather conditions.

## Overview

The gadget selection follows a priority system:
1. **Status-based gadgets** (highest priority) - Privacy modes
2. **Weather-based gadgets** - Environmental conditions
3. **Speed-based gadgets** (default) - Movement speed

## Functions

### `getGadgetForSpeed(speed: number): Gadget`

Determines the gadget based on user speed.

**Speed Ranges:**
- `< 10 km/h` → `BACKPACK` (walking)
- `10-60 km/h` → `BAMBOO_COPTER` (biking/driving)
- `> 60 km/h` → `TIME_MACHINE` (highway)

**Example:**
```typescript
import { getGadgetForSpeed } from '@/utils/gadget';

const gadget = getGadgetForSpeed(5); // Returns Gadget.BACKPACK
```

### `getGadgetForStatus(status: UserStatus): Gadget | null`

Determines the gadget based on user status (privacy modes).

**Status Mappings:**
- `GHOST_MODE` → `INVISIBLE_CLOAK`
- `DND` → `TENT`
- Other statuses → `null` (no special gadget)

**Example:**
```typescript
import { getGadgetForStatus } from '@/utils/gadget';
import { UserStatus } from '@/types/avatar.types';

const gadget = getGadgetForStatus(UserStatus.GHOST_MODE); 
// Returns Gadget.INVISIBLE_CLOAK
```

### `getGadgetForWeather(weather: WeatherCondition): Gadget | null`

Determines the gadget based on weather conditions.

**Weather Mappings:**
- `RAIN` → `UMBRELLA`
- Other conditions → `null` (no special gadget)

**Example:**
```typescript
import { getGadgetForWeather } from '@/utils/gadget';
import { WeatherCondition } from '@/types/avatar.types';

const gadget = getGadgetForWeather(WeatherCondition.RAIN); 
// Returns Gadget.UMBRELLA
```

### `getGadget(speed: number, status: UserStatus, weather: WeatherCondition): Gadget`

**Recommended function** - Determines the final gadget considering all factors with proper priority.

**Priority System:**
1. Status-based gadgets (privacy modes) - highest priority
2. Weather-based gadgets
3. Speed-based gadgets - default/fallback

**Example:**
```typescript
import { getGadget } from '@/utils/gadget';
import { UserStatus, WeatherCondition } from '@/types/avatar.types';

// Example 1: Status overrides everything
const gadget1 = getGadget(100, UserStatus.GHOST_MODE, WeatherCondition.RAIN);
// Returns Gadget.INVISIBLE_CLOAK (status priority)

// Example 2: Weather overrides speed
const gadget2 = getGadget(100, UserStatus.DRIVING, WeatherCondition.RAIN);
// Returns Gadget.UMBRELLA (weather priority)

// Example 3: Speed-based when no overrides
const gadget3 = getGadget(100, UserStatus.DRIVING, WeatherCondition.CLEAR);
// Returns Gadget.TIME_MACHINE (speed-based)
```

## Usage in Components

### Avatar Component Example

```typescript
import { getGadget } from '@/utils/gadget';
import { AvatarProps } from '@/types/avatar.types';

function Avatar({ user, speed, status, weather }: AvatarProps) {
  const gadget = getGadget(speed, status, weather);
  
  return (
    <MapView.Marker coordinate={{ latitude, longitude }}>
      <View>
        <GadgetIcon gadget={gadget} />
        <UserAvatar user={user} />
      </View>
    </MapView.Marker>
  );
}
```

## Requirements Validation

This implementation satisfies the following requirements:

- **Requirement 4.1**: Walking (< 10km/h) → BACKPACK ✓
- **Requirement 4.2**: Biking/Driving (10-60km/h) → BAMBOO_COPTER ✓
- **Requirement 4.3**: Highway (> 60km/h) → TIME_MACHINE ✓
- **Requirement 5.1**: Ghost Mode → INVISIBLE_CLOAK ✓
- **Requirement 5.2**: DND Mode → TENT ✓
- **Requirement 9.2**: Rain → UMBRELLA ✓

## Testing

Unit tests are available in `gadget.test.ts`. Run with:

```bash
npm test utils/gadget.test.ts
```

Manual verification script available in `gadget.verify.ts`.

## Related Files

- `types/avatar.types.ts` - Type definitions for Gadget, UserStatus, WeatherCondition
- `components/map/Avatar.tsx` - Avatar component that uses this logic
- `utils/gadget.example.ts` - More usage examples
