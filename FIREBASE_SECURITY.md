# Firestore security fix

This project was using Firestore test mode, which expires and then blocks all requests.

## What was added

- `firestore.rules`: production-ready rules for the `progress` collection.
- `firebase.json`: points Firebase CLI to the Firestore rules file.

## Deploy the rules

From the repository root, run:

```bash
firebase login
firebase use mathezy-prototype-starting
firebase deploy --only firestore:rules
```

After deployment, each signed-in user can only read/write their own `progress` documents.
