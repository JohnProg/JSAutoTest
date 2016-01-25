// READ ME!
//
// when entering terms in the dictionary file please organize
// them by module name or make them global terms
//
// within module collections please organize terms in an
// alphabetical order


exports.global = {
  CANCEL: 'Cancel',
  DONE: 'Done',
  SAVE: 'Save',
};


exports.DueDays = {
  DAY: ' day',
  DAY_PAST_DUE: ' day past due',
  DAYS: ' days',
  DAYS_PAST_DUE: ' days past due',
  DUE_IN: 'Due in ',
  DUE_TODAY: 'Due today!',
  PAID: 'Paid!',
};

exports.InvoiceLeads = {
  PAID: 'Sleep well tonight.',
  NOT_DUE: 'Looking good.',
  DUE_WITHIN_5_DAYS: 'It\'s a good time to check in with CLIENT_NAME',
  DUE_TODAY: 'Just a heads up.',
  DUE_OVER_5_DAYS: 'Does CLIENT_NAME have everything they need?',
  DUE_OVER_10_DAYS: 'Does CLIENT_NAME have everything they need?',
  DUE_OVER_15_DAYS: 'Is everything okay with CLIENT_NAME?',
  DUE_OVER_30_DAYS: 'Fair, firm and reasonable. Options for CLIENT_NAME.',
  DUE_OVER_45_DAYS: 'Tough love. Here are some firm and fair options.',
  DUE_OVER_90_DAYS: 'Tough love. Here are some firm and fair options.',
};

exports.Months = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

exports.ShortMonths = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
};

exports.ShortDays = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
  7: 'Sun',
};

exports.About = {
  ABOUT_TITLE: 'About PwC SBS',
  PRIVACY_LINK: 'View privacy policy',
  TERMS_LINK: 'View terms & conditions',
  COPYRIGHT: '© 2015 PwC. All rights reserved. PwC refers to the US member firm or one of its subsidiaries or affiliates, and may sometimes refer to the PwC network. Each member firm is a separate legal entity. Please see www.pwc.com/structure for further details.',
};

exports.ActionDetails = {
  EMAIL_TITLE: 'Email Template',
  PHONE_TITLE: 'Talking Points',
  NO_INFO_PRESENT_TITLE: 'Contact your client',
  NO_PHONE_PRESENT_TEXT: 'Enter this contact\'s phone number to make this call. PwC SBS will never automate or contact your clients.',
  NO_EMAIL_PRESENT_TEXT: 'Enter this contact\'s email address to send this email. PwC SBS will never automate or contact your clients.',
  NO_INFO_PRESENT_ACCEPT_CAPTION: 'Add contact info',
  NO_INFO_PRESENT_DECLINE_CAPTION: 'Not now',
  OPEN_IN_MAIL_APP: 'Open template in mail app?',
  SEND_TO_SELF: 'Send script to yourself?',
};

exports.CashProgress = {
  ACTUAL: 'Actual income',
  EXPECTED: 'Expected income',
  ACTIONABLE: 'Actionable invoices',
  PAYMENT_GOAL: '\'s Payment goal',
};

exports.EnterFirstInvoice = {
  TITLE: 'Thanks for signing up!',
  SUBTITLE: 'Let\'s get going. Do you have an invoice that we can start tracking? Don\'t worry, we\'ll never initiate or automate contact with your clients.',
};

exports.EnterInvoice = {
  AMOUNT_OWED: 'Amount owed',
  BILLING_CONTACT_NAME: 'Contact name',
  BILLING_CONTACT_EMAIL: 'Contact email',
  BILLING_CONTACT_PHONE: 'Contact phone',
  CLIENT_NAME: 'Client name',
  FIRST_INVOICE_ACCEPT_CAPTION: 'Enable notifications',
  FIRST_INVOICE_ALERT_TEXT: 'Enable push notifications so we can let you know when and how to check-in with your clients.',
  FIRST_INVOICE_ALERT_TITLE: 'This is exciting! You have entered your first invoice!',
  FIRST_INVOICE_REJECT_CAPTION: 'Later',
  REJECT_PRIMER_TITLE: 'No worries!',
  REJECT_PRIMER_TEXT: 'You can always enable push notifications in Apple Settings for PwC SBS',
  REJECT_PRIMER_ACCEPT_CAPTION: 'Got it',
  INVOICE_DATE: 'Invoice date',
  INVOICE_DATE_ACTION_TEXT: 'Select invoice date',
  NOTES: 'Notes',
  SAVE_AND_FINISH: 'Save and finish',
  SAVE_AND_ADD_ANOTHER: 'Save and add another',
  ADD_FIRST_INVOICE: 'Add my first invoice',
  SKIP_FOR_NOW: 'Skip for now',
  TERMS: 'Terms',
  TERMS_ACTION_TEXT: 'Select invoice term',
  TITLE: 'Add Invoice',
  INVALID_EMAIL: 'Valid email must include \'@\' and \'.\'',
  INVALID_PHONE: 'Phone numbers must be 10 digits',
};

exports.EditInvoice = {
  AMOUNT_OWED: 'Amount owed',
  BILLING_CONTACT_NAME: 'Contact name',
  BILLING_CONTACT_EMAIL: 'Contact email',
  BILLING_CONTACT_PHONE: 'Contact phone',
  CLIENT_NAME: 'Client name',
  FIRST_INVOICE_ACCEPT_CAPTION: 'Enable notifications',
  FIRST_INVOICE_ALERT_TEXT: 'Enable push notifications so we can let you know when and how to check-in with your clients.',
  FIRST_INVOICE_ALERT_TITLE: 'This is exciting! You have entered your first invoice!',
  FIRST_INVOICE_REJECT_CAPTION: 'Later',
  INVOICE_DATE: 'Invoice date',
  INVOICE_DATE_ACTION_TEXT: 'Select invoice date',
  NOTES: 'Notes',
  SAVE_AND_FINISH: 'Save and finish',
  SAVE_AND_ADD_ANOTHER: 'Save and add another',
  ADD_FIRST_INVOICE: 'Add my first invoice',
  SKIP_FOR_NOW: 'Skip for now',
  TERMS: 'Terms',
  TERMS_ACTION_TEXT: 'Select invoice term',
  TITLE: 'Edit Invoice',
};

exports.InvoiceArchiveList = {
  TITLE: 'Invoice Archive',
  NO_INVOICE_ARCHIVED: 'You haven\'t archived any invoices.',
  CLEAR_SPACE: 'You can archive paid invoices to clear up space in your invoice list.'
};

exports.Compliance = {
  BUSINESS_ADDRESS: 'Business Address',
  BUSINESS_NAME: 'Business Name',
  CITY: 'City',
  COMPLIANCE_EMAIL: 'support@businessos.com',
  CONTINUE: 'CONTINUE',
  DONT_SEE_YOUR_BUSINESS: 'Don\'t see your business?',
  EMAIL: 'Email',
  EMAIL_FORMAT_ERROR: 'Enter a valid email address',
  NOT_COMPLIANT_PROMPT1: 'Sorry, it\'s not you, it\'s us.',
  NOT_COMPLIANT_PROMPT2: 'It seems your business is too big for our community right now.',
  NOT_COMPLIANT_PROMPT3: 'If you\'like to talk about it',
  NOT_COMPLIANT_PROMPT4: 'Contact us',
  USSTATE: 'State',
  USSTATE_ACTION_TEXT: 'Select your state',
  STEP1: 'STEP 1 of 5',
  STEP1_BUSINESS_NAME_ERROR: 'Enter more than 2 characters.',
  STEP1_CREATE: 'CREATE PROFILE',
  STEP1_DESCRIPTION: 'Where should customers send your money?',
  STEP1_TITLE: 'Getting paid faster starts with accurate information.',
  STEP1_USSTATE_ERROR: 'Enter a vaild US states abbreviation.',

  STEP2: 'STEP 2 of 5',
  STEP2_TITLE: 'The Right Fit',
  STEP2_DESCRIPTION: 'Answer a few questions to make sure you belong in our community of small businesses.',
  STEP2_PROMPT: 'How many employees do you have?',

  STEP3: 'STEP 3 of 5',
  STEP3_CONTINUE: 'CONTINUE',
  STEP3_DESCRIPTION: 'Answer a few questions to make sure you belong in our community of small businesses.',
  STEP3_PROMPT: 'Does your business own all or a part of any other business?',
  STEP3_SWITCH_TEXT_LEFT: 'No',
  STEP3_SWITCH_TEXT_RIGHT: 'Yes',
  STEP3_TITLE: 'The Right Fit',

  STEP4: 'STEP 4 of 5',
  STEP4_CONTINUE: 'CONTINUE',
  STEP4_DESCRIPTION: 'Answer a few questions to make sure you belong in our community of small businesses.',
  STEP4_PROMPT: 'Does any other business own all or a part of your business?',
  STEP4_SWITCH_TEXT_LEFT: 'No',
  STEP4_SWITCH_TEXT_RIGHT: 'Yes',
  STEP4_TITLE: 'The Right Fit',

  STEP5: 'STEP 5 of 5',
  STEP5_DESCRIPTION: 'We take accuracy seriously. Help us confirm your information by tapping it below.',
  STEP5_TITLE: 'One last thing.',
  STEP5_LOADING: 'LOADING...',
  STEP5_NO_INFORMATION: 'SORRY, WE HAVE NO MATCHES.',
  ZIPCODE: 'Zip Code',
};

exports.InvoiceList = {
  ADD_INVOICE: ' Invoices',
  ADD_YOUR_INVOICES: 'Tap + to add your invoices below so we can help you have the right conversation at the right time.',
  ARCHIVE_LIST: 'Invoice archive',
  ENABLE_PUSH_NOTIFICATIONS: 'Enable push notification',
  ONE_INVOICE_HEADER: 'You\'ve got 1 upcoming invoice.',
  ONE_INVOICE_PARAGRAPH: 'Tap on this invoice to learn how to collect on this payment or add more invoices.',
  MULTIPLE_INVOICE_HEADER_START: 'You\'ve got ',
  MULTIPLE_INVOICE_HEADER_END: ' upcoming invoices.',
  MULTIPLE_INVOICE_PARAGRAPH: 'Tap on this invoice to learn how to collect on this payment, or add the rest of your invoices',
  PAID_HEADER: 'You\'re awesome!',
  PAID_PARAGRAPH: 'All your invoices are paid! Do you want to add more invoices?',
  HERO_TITLE: 'Tell us about your clients.',
  HERO_SUBTITLE: 'Tell us who they are and when you expect them to pay you. Then we’ll remind you to check in on them at the right time.',
  NO_INVOICE_ENTERED: 'You haven\'t entered any invoices. \n\nEnter an invoice and start getting on top of your account receivable.',
  TITLE: 'Upcoming Payments',
  WELL_HELP: 'You haven\'t entered any invoices to track!',
  LOG_OUT: 'Log out',
  HOW_IT_WORKS: 'How it works',
  ABOUT: 'About PwC SBS',
  EMAIL_SUPPORT: 'Email customer support',
  SUPPORT_ADDRESS: 'support@businessos.com',
  SUPPORT_SUBJECT: 'PwC SBS customer support',
  WE_RECOMMEND: 'We recommend a',
  INSTRUCTION_BUTTON: 'How does this work?',
  INSTRUCTION_TITLE: 'How does this work?',
};

exports.InvoiceDetails = {
  ADD_INVOICE: ' Invoices',
  ARCHIVE_INVOICE_ACCEPT_CAPTION: 'Archive it',
  ARCHIVE_INVOICE_ALERT_TEXT: 'It will be removed from your invoice list and into your invoice archive.',
  ARCHIVE_INVOICE_ALERT_TITLE: 'Are you sure you want to archive this invoice?',
  ARCHIVE_INVOICE_REJECT_CAPTION: 'Not yet!',
  CLIENT_INVOICE_IS: '\'s invoice is ',
  CLIENT_NAME: 'Client name',
  DELETE_INVOICE_ACCEPT_CAPTION: 'Delete it',
  DELETE_INVOICE_ALERT_TEXT: 'Once your invoice is deleted, it cannot be undone.',
  DELETE_INVOICE_ALERT_TITLE: 'Are you sure you want to delete this invoice?',
  DELETE_INVOICE_REJECT_CAPTION: 'Not yet!',
  DUE_DATE: 'Due date',
  HERO_TITLE: 'Tell us about your clients.',
  HERO_SUBTITLE: 'Enter your invoices and we\'ll help you have the right conversation at the right time.',
  INVOICE_AMOUNT: 'Invoice amount',
  INVOICE_DATE: 'Invoice date',
  MARK_AS_ARCHIVED: 'Move invoice to archive?',
  MARK_AS_DONE: 'Mark as done',
  MARKED_AS_DONE: 'You did this!',
  MARK_AS_PAID: 'Mark invoice as paid?',
  MARKED_AS_ARCHIVED: 'Invoice archived successfully!',
  MARKED_AS_PAID: 'Wohoo, your invoice was paid!',
  NO_INVOICE_ENTERED: 'You haven\'t entered any invoices. \n\nEnter an invoice and start getting on top of your account receivable.',
  TITLE: ' Invoices',
  WHATS_NEXT: 'What\'s next?',
  HANG_TIGHT: 'Hang tight.',
  NO_ACTION: 'This invoice is on track. Nothing to worry about here.',
  UNARCHIVE_INVOICE_ACCEPT_CAPTION: 'Unarchive it',
  UNARCHIVE_INVOICE_ALERT_TEXT: 'It will be removed from your invoice archive and into your invoice list.',
  UNARCHIVE_INVOICE_ALERT_TITLE: 'Are you sure you want to unarchive this invoice?',
  UNARCHIVE_INVOICE_REJECT_CAPTION: 'Not yet!',
  UNMARK_AS_ARCHIVED: 'Unarchive invoice?',
  YES: 'Yes',
  EDIT_LABEL: 'Edit invoice',
  DELETE_LABEL: 'Delete invoice',
};

exports.UserAuthentication = {
  CHARACTER_TYPE_ERROR: 'Doesn\'t include necessary character types',
  EMAIL_PLACEHOLDER: 'email',
  INVALID_EMAIL: 'Valid email must include \'@\' and \'.\'',
  INVALID_PASSWORD: 'Valid password must meet rules below',
  INVALID_LOGIN_PASSWORD: 'Please type a valid password',
  LOGIN_HEADER: 'Log Into Your Account',
  LOGIN_SUBMIT: 'Log in',
  MIN_PASSWORD_ERROR: 'This password is too short',
  PASSWORD_PLACEHOLDER: 'password',
  PASSWORD_RULES_TITLE: 'For your privacy, passwords must:',
  PASSWORD_RULES_ITEM: [
      '* Be at least 8 characters long',
      '* Include a number ,an uppercase letter and a lowercase letter',
      '* Include a special character (e.g. ?, *, &, %)',
  ],
  PROMPT_NO: 'No, skip for now',
  PROMPT_YES: 'Yes, I want to enter an invoice',
  SIGNUP_HEADER: 'You\'re in! Welcome to the community.',
  SIGNUP_SUBHEADER: 'How would you like to login to PwC small business services?',
  SIGNUP_SUBMIT: 'FINISH UP',
  TO_LOGIN: 'Have an account? Log in',
  TO_SIGNUP: 'First time? Create an account',
};

exports.WhiteListWall = {
  TITLE: 'Welcome to PwC\'s small business services!',
  SUBTITLE: 'We\'re currently in private beta. If you are interested, you can join the beta by completing this quick survey.',
  ACTION_TEXT: 'Let me in!',
  TO_LOGIN: 'Have an account? Log in',
};

exports.NewUserExperience = {
  LOGIN_LINK: 'Already have an account? Login',
  ONBOARDING_HEADER_INVOICES: 'Give us your outstanding client invoices. We\'ll track them.',
  ONBOARDING_HEADER_REMINDERS: 'When it\'s time to get paid, we\'ll remind you.',
  ONBOARDING_HEADER_RECOMMENDATIONS: 'We\'ll walk you through the best way to reach out to your client. Good payments make good relationships.',
  ONBOARDING_SKIP_BUTTON: 'Skip to sign up',
  ONBOARDING_NEXT_BUTTON: 'Next',
  ONBOARDING_SIGN_UP_BUTTON: 'Sign up now',
  ONBOARDING_BACK_BUTTON: 'Back',
  TO_LOGIN: 'Have an account? Log in',
  WELCOME_BUTTON: 'Let\'s start',
  WELCOME_HEADER: 'Turn your outstanding invoices into outstanding relationships.',
  WELCOME_SUBHEADER: 'Welcome to PwC\'s small business services!',
};

exports.Connectivity = {
  NO_CONNECTION: 'No connection available',
};
