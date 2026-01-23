# Usage UI Updates

The following updates were made to correctly display "free"/"paid" status and upgrade options:

## 1. Usage Component (`src/modules/projects/ui/components/usage.tsx`)
- Integrated `useAuth` to check for Pro plan status.
- Conditionally displays "paid credits remaining" for Pro users and "free credits remaining" for Free users.
- Hides the "Upgrade" button for users who already have Pro access.

## 2. Project Header (`src/modules/projects/ui/components/project-header.tsx`)
- Application header for Project View.
- Added a conditional "Upgrade" button that only appears for users without the Pro plan.
- Placed conveniently next to the user profile/saved status.

These changes ensure that paid users see their correct status and aren't prompted to upgrade unnecessarily, while free users see clear "free" labeling and upgrade calls to action.
