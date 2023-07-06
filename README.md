# Workspace ONE UEM Reloader Firefox Extension

![Extension Icon](icon.png)

## Description

The Workspace ONE UEM Reloader is a Firefox extension created to address the limitations of the 15-minute timer in Workspace ONE UEM. This extension automatically reloads any webpage with a URL matching the pattern "*.awmdm.com" after a period of inactivity. It aims to provide a seamless experience for users by refreshing the page only when necessary.

## Features

- Automatic reload: The extension reloads any "*.awmdm.com" webpage after 8 minutes of inactivity.
- Idle detection: The extension utilizes the Firefox idle API to monitor the user's activity and trigger the reload when idle.
- Tab tracking: The extension tracks and displays the active tabs with "*.awmdm.com" URLs in the popup.
- Active tab indicator: The extension visually indicates the active tabs in the popup for easy identification.
- Countdown timer: The extension displays a countdown timer in the popup to show the remaining time before the next reload.

## Installation

To install the Workspace ONE UEM Reloader Firefox Extension, follow these steps:

1. Download the extension files from the GitHub repository.
2. Open Firefox and enter "about:debugging" in the address bar.
3. Click on "This Firefox" in the sidebar.
4. Click on "Load Temporary Add-on..." and select the "manifest.json" file from the downloaded extension files.
5. The extension will be loaded temporarily and ready to use.

## Usage

Once the extension is installed, you can use it as follows:

1. Click on the extension icon in the Firefox toolbar.
2. The popup will display the active tabs with "*.awmdm.com" URLs and the countdown timer.
3. If any active tab matches the criteria, it will be visually indicated as active.
4. The countdown timer shows the remaining time before the next reload.
5. If the tab is inactive for 8 minutes, it will be automatically reloaded.
6. Clicking on an active tab in the popup will reset the countdown timer for that tab.

## Customization

The Workspace ONE UEM Reloader extension can be customized to suit your needs:

- Reload Interval: You can adjust the reload interval by modifying the idle duration in the code (e.g., change 8 minutes to a different value).
- Styling: You can customize the appearance of the extension by modifying the CSS styles in the "popup.css" file.

## Credits

This Firefox extension was created by dmarovi@gmail.com as a personal project. It was developed using web technologies such as HTML, CSS, and JavaScript, along with the Firefox extension APIs.
ChatGPT was used in the making of this code. 
