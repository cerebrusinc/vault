---
app_name: "Vault"
title: "Vault: store and access your passwords anywhere"
tagline: "Generate secure passwords, save them in space and view them on earth"
theme_color: "#161616"
git: "https://github.com/cerebrusinc/vault"
homepage: "https://www.cerebrus.dev"
---

## Vault

A tool to help you securely handle your passwords for yourself on devices you deem fit. Furthermore, it can also generate passwords for you to pick and choose if you sift click the passwords input (only on computer).

**NOTE:** There is no encryption of passwords in your db as only you will be able to access it. The only extra layer of security we have added is a auth pin set by you upon first visit to your `Vault`.

### Usage Instructions

1. Install Vault
2. Go to your Deta Horizon and add a card for `installed apps` for Vault
3. Click the Deta icon on the top left off the card and open settings
   - Open the keys tab and generate a data key (make sure to copy it)
   - Next open the configuration tab and paste your data key in the value section for `MICRO_KEY`
4. Save changes and that's it!

### Features

- Create password data (generate password capability); includes username, service, and link to service (e.g service = "Deta Space")
- Edit password and other data
- Delete password and other data
- Search list of passwords and other data
- View password and other data
  - Open link
  - Copy to clipboard

### Feedback

You can always [open an issue](https://github.com/cerebrusinc/vault/issues).
