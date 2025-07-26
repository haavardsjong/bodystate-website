# Frequently Asked Questions

## User Guide

### What is BodyState?

BodyState transforms your health data into a battery for body and mind, helping you tailor your lifestyle, habits, and training programs to unlock your full potential.

At its core, BodyState calculates a score from 1 to 100, representing your overall vitality and readiness. A score closer to 100 indicates that you are well-rested and ready to tackle life's challenges.

The foundation of BodyState is built on six crucial metrics that significantly impact your health: sleep quality, heart rate variability (HRV), resting heart rate, fatigue (training load), respiratory rate, and wrist temperature. These metrics are measured against your personal 42-day baselines to assess your current state.

You recharge your battery while you sleep. How well you recharge depends on your sleep stages—deep sleep provides extra recovery benefits, while awake periods during the night reduce the effectiveness of your rest. BodyState analyzes the quality of your sleep by examining these stages alongside your HRV and heart rate.

During the day, your battery depletes, and the rate of depletion is influenced by your activity level and sleep pressure. High activity drains the battery more quickly, while sleep pressure builds the longer you stay awake.

### How does the BodyState Score work?

The BodyState score ranges from 1 to 100, representing your overall vitality and readiness. A score closer to 100 indicates that you are well-rested and prepared to tackle life's challenges, while a lower score suggests that you might need rest and recovery. The BodyState score shouldn't necessarily dictate your daily activities, but it should help you be mindful of how you feel and make sound decisions about the type or intensity of your activities, potentially prioritizing more rest if needed.

The score is calculated based on six key factors: sleep quality, fatigue (training load), sleeping heart rate variability (HRV), sleeping heart rate, respiratory rate, and wrist temperature. In simple terms the following will generally lead to a higher score:

- Better sleep quality and duration compared to your average
- Being well rested compared to your usual activity level
- A lower heart rate than your average during sleep
- A higher HRV than your average during sleep
- Balanced respiratory rate compared to your baseline
- Normal wrist temperature compared to your baseline

The crucial part is how your daily measurements stack up against your personal baseline, which is your average range of values from the past 42 days. For instance, if your baseline sleeping heart rate is between 55 and 65, this range will be used to assess your current heart rate. Values closer to the lower end are better.

Throughout the day, your BodyState score will decrease. The rate of this decrease depends on your level of activity and how long you've been awake. If you are mostly at rest during the day, your score will decrease gradually, while an exercise session will cause a more immediate drop in your BodyState score.

### What are Baselines?

A baseline is essentially your personal average range of the given health metric.

In the context of BodyState, baselines are computed using up to 42 days of your tracked data. This approach ensures that the evaluation of your current health metrics is both personalized and reliable.

Using baselines to evaluate today's state is crucial because health metrics vary widely among individuals. A baseline provides a personalized frame of reference, making your BodyState score uniquely tailored to you.

#### How Baselines Are Computed

To calculate a baseline, we use statistical methods to determine the average (mean) and the variability (standard deviation) of your health metrics over the chosen period.

Here's a simplified example using sleep data, which applies similarly to other metrics like heart rate and HRV:

1. **Collect Data**: Gather sleep data for the past 42 days.
2. **Calculate Mean**: Determine the average sleep duration over this period.
3. **Calculate Standard Deviation**: Measure the variability in your sleep duration.
4. **Set Baseline Range**: Establish your baseline as a range from one standard deviation below the mean to one standard deviation above the mean.

For example, if the mean sleep duration over 60 days is 7 hours, and the standard deviation is 1 hour, your baseline range would be 6 to 8 hours.

### About Sleep

Sleep is the cornerstone of BodyState. It establishes a consistent protocol for measuring key metrics. Not only is sleep a crucial input for your BodyState, but it is also the period when HRV and resting heart rate are measured and compared to your history to assess your current state. High-quality sleep is vital for replenishing your body's energy, significantly enhancing your daily readiness and overall vitality.

### About Fatigue

Fatigue, also known as Acute Training Load (ATL), measures your recent activity levels. It averages your daily active energy expenditure over the past seven days, prioritizing recent ones. ATL focuses on total workload, not training type. The method provides a clear picture of recent exertion and helps you manage your recovery needs.

### About Sleeping Heart Rate Variability (HRV)

Heart Rate Variability (HRV) is a key metric for assessing recovery and overall health. High HRV signals restfulness and readiness, while low HRV indicates stress or fatigue. Keeping HRV stable within your personal baseline is crucial, as very high values can also be concerning. BodyState monitors your HRV during sleep to reliably assess the effects of your lifestyle on your well-being.

### About Sleeping Heart Rate (HR)

Sleeping Heart Rate (HR) is a key metric for understanding your fitness level and cardiovascular health. HR is the number of heartbeats per minute while at rest, showing how efficiently your heart works when inactive. Generally, a lower resting heart rate means better cardiovascular fitness and more efficient heart function, as your heart pumps more blood with fewer beats.

## General Questions

### I just started using BodyState and I don't see any data in the app

If you just downloaded BodyState and your data is not populating into the app, please follow these steps:

First note that you will need 7 full days of sleep data from your Apple Watch before BodyState can start showing you metrics. That's because BodyState can only assess your health data if it has some health history as a reference point. Sleep tracking with your iPhone is not supported. If you're unsure whether your sleep data is being tracked using your iPhone, check the Health app. Data tracked by the iPhone typically appears as "in bed" values.

Ensure that you have granted permission for BodyState to access your health data from Apple Health. If not read how to under the Health Access section in this page.

If the problem persists, you can attempt to resolve it by reinstalling the BodyState app.

### How can I increase the accuracy of BodyState?

While not required, it is recommended that you turn on AFib History on your Apple Watch so it can record more heart rate samples during sleep. However, please note that turning on AFib History could potentially disable high heart rate alerts on your Apple Watch, so proceed with caution.

1. On your iPhone, open the Health app.
2. Tap Browse, then tap Heart.
3. Tap AFib History.
4. Tap Set Up, then tap Get Started.
5. Enter your Date of Birth.
6. Select Yes to indicate that you have been diagnosed with AFib by a doctor, then tap Continue.
7. Tap Continue to learn more about AFib History, the results you may see, and life factors.
8. Tap Done.

### I'm having issues and have already reinstalled the app

If your data is still missing after reinstalling BodyState, please check Apple Health to confirm that your other apps or devices are correctly writing their data to your device. If you see data in Apple Health such as active calories and a detailed sleep reports and it is not being pulled in to BodyState, you should report this as a bug to us. Otherwise, this may indicate an issue with another app or device.

### Why does my sleep, HRV or HR differ from the Health App?

Sleep duration can differ from the Health app because Apple includes the awake stage in the sleep duration, while BodyState does not.

HRV differs from the Health App because BodyState computes your average HRV during sleep, while Apple uses all HRV readings to compute the average.

Resting Heart Rate (HR) differs from the Health App because BodyState computes your average HR during sleep, while Apple uses HR readings while you are at rest such as sitting down to compute the metric.

### My iPhone widget is not updating

There are several reasons why your widget might not be updating, many of which stem from iOS's stringent background processing restrictions designed to preserve battery life. Here are some common factors that could impact widget updates:

**Background App Refresh Settings**: The widget relies on the app to refresh content in the background. If Background App Refresh is disabled for BodyState (Settings > General > Background App Refresh), the widget may not update as expected. Ensure this setting is enabled for BodyState.

**Low Power Mode**: When your iPhone is in Low Power Mode, background activities, including widget updates, are significantly reduced to conserve battery. This can prevent the widget from fetching new data.

**Network Connectivity**: A stable internet connection is necessary for the app to fetch the latest data. If your device has poor or no connectivity, the widget will not update.

**iOS Widget Update Frequency**: iOS controls how often widgets can update to manage battery life and system performance. Widgets are not real-time displays and have limits on how frequently they can refresh. This means there might be a slight delay between when new data is available in the app and when it appears on the widget.

**App Activity**: Widgets often update more frequently if the main app is used regularly. If you haven't opened BodyState in a while, iOS might reduce the frequency of its widget updates.

**Widget Glitches**: Occasionally, widgets may experience temporary glitches. Removing the widget from your Home Screen and adding it back can sometimes resolve these issues.

**App Updates**: Ensure BodyState is updated to the latest version from the App Store. Updates often include bug fixes and performance improvements that can affect widget functionality.

**iOS Updates**: Similarly, keeping your iOS updated is crucial, as Apple frequently releases updates that can impact widget performance and background processing.

**Restart Your Device**: A simple restart of your iPhone can often resolve minor software glitches that might be affecting widget updates.

If you have checked these factors and the widget still isn't updating, please contact support for further assistance.

### Why doesn't my Watch app sync?

If the BodyState watchOS app displays "Open Bodystate on iPhone to sync" during your first use of the app, ensure that the BodyState app is opened first on your watch and then on your iPhone. The iOS app should display your current BodyState without any errors for successful syncing. It is also necessary that your watch is properly connected. To verify that your Apple Watch is connected to your iPhone, open the Control Center by pressing the side button and look for the Connected status icon, which typically appears as a green iPhone symbol.

If you encounter an error related to health access, data access, or the absence of sleep data, this message will continue to appear on your watch until the issue is resolved on your iPhone.

If you've followed these steps and your watch doesn't sync when you open the iOS app, try restarting the watch app. If the issue persists, consider reinstalling both the iOS and watchOS apps.

### Why aren't the Watch Complications in sync between my Watch and Phone app?

The refresh time for complications is controlled by the Watch OS for battery optimization. Complications will update roughly each hour throughout the day. Before a refresh you can expect the complication to be slightly off sync from the iOS app as they do not update at the same time.

## Sleep Tracking

### How Do I Track My Sleep?

BodyState requires you to track your sleep using your Apple Watch or a device that syncs with the Health app.

Sleep tracking on the Apple Watch involves enabling Sleep Focus mode. You have the option to manually activate this mode each night before bed and deactivate it each morning, or set up a sleep schedule that automatically handles this. We recommend manually controlling Sleep Focus mode, as sleep schedules can vary.

**Getting Started with Sleep Tracking on iPhone:**

1. Open the Health app.
2. Tap "Browse" at the bottom of the screen.
3. Select "Sleep."
4. Tap "Get Started" under "Set Up Sleep."
5. Follow the prompts to define your Sleep Goals, Bedtime, Wake-Up Times, and activate Sleep Focus.

**Getting Started with Sleep Tracking on Apple Watch:**

1. Launch the Sleep app.
2. Complete the onscreen setup to create a sleep schedule.

**To Activate Sleep Focus at Night:**

1. Press the side button to open Control Center.
2. Tap the moon icon.
3. Choose "Sleep" from the menu; a small greenish-blue bed icon will then appear at the top of the watch face.

**To Deactivate Sleep Focus in the Morning:**

1. Access the Control Center again
2. Tap the moon icon.
3. Select "Sleep" and tap it to turn off Sleep Focus.

**Important Considerations**

- **Sleep Tracking:** Needs at least four hours of sleep data each night to be effective.
- **Battery Charge:** Ensure your device has at least a 30% charge before going to bed.

### My Sleep Data Isn't Appearing. What Should I Do?

If you're tracking sleep but encountering an error that shows no sleep data, here are steps to troubleshoot the issue.

**Initial Check:**

For BodyState to function properly, a detailed sleep report must be available in the Health app. To verify this, open the Health app on your iPhone, navigate to the Sleep section, and check for a report covering the current night, including stages like core and deep sleep. Sleep tracking with your iPhone is not supported. If you're unsure whether your sleep data is being tracked using your iPhone, check the Health app. Data tracked by the iPhone typically appears as "in bed" values. If you don't see a detailed sleep report, despite tracking your sleep, consider the following steps:

**Speed Up Syncing:**

To speed up syncing, try opening the source device or app. For example, open the Sleep app on your Apple Watch, or if you use AutoSleep, open the app to kick-start the syncing process. If you use a Garmin device, open connect and make sure sleep data is synced.

**General troubleshooting:**

**Change Sleep Source:** You can manually try to change the sleep source if you have other devices or apps that write to the Health App. To do this, in BodyState navigate to Settings > Sleep Data Priority.

**Apple Watch Troubleshooting:**

**Bluetooth Connectivity:** Ensure Bluetooth is enabled on your device. It's easy to accidentally turn it off.

**Airplane Mode:** Check if either your iPhone or Apple Watch is in airplane mode, which could prevent data synchronization.

**Passcode**: When your watch is locked with a passcode, sleep data will be recorded but will not appear until the watch is unlocked. Many users charge their watch before bed and put it on just before sleeping, which prompts the need to enter the passcode.

**Sleep Tracking Setting:** Check if 'Track Sleep with Apple Watch' is activated. This setting is vital for using Sleep Stages. To enable it, go to the Apple Watch App on your iPhone, scroll down to 'Sleep,' and toggle the 'Track Sleep with Apple Watch' option.

**Sleep Schedules and Focus:** If you are using Apple's sleep schedules, make sure the 'Use Schedule for Sleep Focus' option is correctly configured. Incorrect settings here can lead to Sleep Focus turning off at inappropriate times, affecting data capture.

**Battery Levels:** Verify if your Apple Watch battery dropped to 10% or lower. The watch needs sufficient power to record background heart rate data essential for sleep tracking.

**Wrist Detection:** Confirm that wrist detection is enabled on your Apple Watch. This feature is necessary for gathering background heart rate data. Enable it in the Apple Watch app under the 'Passcode' settings by turning on 'Wrist Detection.'

### How Do I Select Another Sleep Source?

You have the option to manually choose which sleep source BodyState should prioritize, such as a third-party app like Autosleep or a Garmin watch.

To do this, navigate to Settings > Data & Sources > Source Priority.

In the BodyState app, access the settings by tapping the cog icon in the top right corner. Next, tap on Data & Sources, then select Source Priority, and choose your preferred source.

After selecting a new source, the app will need to reload all data to incorporate this source for computing baselines and today's values. It is essential that this source has been used enough to provide sufficient data (at least 7 nights of sleep data) for accurate baselines.

### Can I Track Sleep with Devices Other Than Apple Watch or Third-Party Apps?

Bodystate is compatible with any device that can transfer its data to Apple Health. However, not every device may integrate smoothly with Apple Health.

By default, BodyState gives priority to data from the Apple Watch. However, you have the option to manually choose which sleep source BodyState should prioritize, such as a third-party app like Autosleep or a Garmin watch.

To do this, in BodyState navigate to Settings > Data & Sources > Source Priority.

### Does Naps Improve My BodyState?

Yes, naps improve the BodyState score.

## Apple Health Access

### How do I Enable Health Access?

1. Open the settings app on your phone.
2. (If on iOS 18, scroll down and tap on "Apps")
3. Scroll down and tap on "Health".
4. Tap on "Data Access & Devices".
5. Scroll down and tap on "BodyState"
6. Tap on "Turn All Categories On"

### I've enabled access but still experience an health access error

If you've enabled health access in settings but still experience issues, please try the following.

First, try to un-toggle and then re-toggle the button that says "Turn All Categories On" in the health access settings.

Turn device on and off again. This often resolves it.

If you still face issues, try deleting BodyState and reinstalling it.

### I see a blank screen in Data Access & Devices > Bodystate

If you don't have the option to provide health access under Settings > Apps > Health > Data Access & Devices > BodyState. In other words, there is blank screen, please try to delete the app and reinstalling. In some instances you also have to restart your phone.

### What is health access and why does BodyState need it?

The Health app was created to help organize your important health information and make it easy to access in a central and secure place.

It collects health and fitness data from your iPhone, iPad, the built-in sensors on your Apple Watch, compatible third-party devices, and apps that use HealthKit.

The Health app is built to keep your data secure and protect your privacy. Your data is encrypted and you are always in control of your health information.

BodyState needs access to some categories of your health data to function as it is the basis for computing the BodyState score.

---
Note: Edit this markdown file and run `npm run content:sync` to update the website.