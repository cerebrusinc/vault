---
app_name: "passmng"
title: "passmng: store and access your passwords anywhere"
tagline: "generate secure passwords, save them in space and view them on earth"
theme_color: "#3d4f87"
git: "https://github.com/cerebrusinc/passmng"
homepage: "https://www.cerebrus.dev"
---

## passmng

A tool to help you securely handle your passwords for yourself on devices you deem fit. Furthermore, it can also generate passwords for you to pick and choose.

**NOTE:** There is no encryption of passwords in your db as only you will be able to access it. The only extra layer of security we have added is a auth pin set by you upon first visit to your `passmng`.

### Usage Instructions

1. Install passmng
2. Go to you Deta Canvas and open the passmng app settings
   - Open the keys tab and generate a data key (make sure to copy it)
   - Next open the configuration tab and paste your data key in the value section for `VITE_MICRO_KEY`
3. Save changes and that's it!

### Features

- Add password; includes username, service, and link to service (e.g service = "Deta Space")
- Edit password and other data
- Delete password and other data
- Search list of passwords and other data
- View password and other data
  - Open link (automatically copies password to clipboard)
  - Copy to clipboard

### Feedback

You can always [open an issue](https://github.com/cerebrusinc/passmng/issues).