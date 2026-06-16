export type Platform = {
  id: string
  name: string
  steps: string[]
  codeNote: string
}

export const PLATFORMS: Platform[] = [
  {
    id: 'wordpress',
    name: 'WordPress',
    steps: [
      'Log in to your WordPress admin dashboard.',
      'Go to Appearance > Theme Editor, or install the "Insert Headers and Footers" plugin (recommended).',
      'If using the plugin: go to Settings > Insert Headers and Footers, paste the script in the "Scripts in Footer" box and click Save.',
      "If using Theme Editor: open your theme's footer.php file and paste the script just before the </body> tag.",
      'Visit your website and look for the CreoBot chat widget in the bottom-right corner.',
    ],
    codeNote: 'Paste this script into your WordPress footer:',
  },
  {
    id: 'wix',
    name: 'Wix',
    steps: [
      'Log in to your Wix account and open your site editor.',
      'Click on your site name in the top left, then go to Settings.',
      'Select "Custom Code" from the left menu.',
      'Click "+ Add Custom Code" in the top right.',
      'Paste the script, set location to "Body - end", and click Apply.',
      'Publish your site. The widget will appear on all pages.',
    ],
    codeNote: 'Paste this script in Wix Custom Code (Body - end):',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    steps: [
      'Log in to your Shopify admin.',
      'Go to Online Store > Themes.',
      'Click "Actions" next to your active theme, then "Edit code".',
      'In the left panel, find and open theme.liquid under Layout.',
      'Paste the script just before the </body> tag.',
      'Click Save. The widget will appear on your entire store.',
    ],
    codeNote: 'Paste this script before </body> in theme.liquid:',
  },
  {
    id: 'squarespace',
    name: 'Squarespace',
    steps: [
      'Log in to your Squarespace account.',
      'Go to Settings > Advanced > Code Injection.',
      'Paste the script into the "Footer" field.',
      'Click Save. The widget will appear on all pages of your site.',
    ],
    codeNote: 'Paste this script in Squarespace Code Injection (Footer):',
  },
  {
    id: 'webflow',
    name: 'Webflow',
    steps: [
      'Log in to your Webflow account and open your project.',
      'Click the gear icon to open Project Settings.',
      'Go to the "Custom Code" tab.',
      'Paste the script in the "Footer Code" section.',
      'Click Save Changes, then publish your site.',
    ],
    codeNote: 'Paste this script in Webflow Project Settings > Custom Code > Footer:',
  },
  {
    id: 'jimdo',
    name: 'Jimdo',
    steps: [
      'Log in to your Jimdo account.',
      'Go to Settings > Head and Footer.',
      'Paste the script in the "Before </body>" field.',
      'Click Save. The widget will appear on all pages.',
    ],
    codeNote: 'Paste this script in Jimdo Settings > Head and Footer:',
  },
  {
    id: 'joomla',
    name: 'Joomla',
    steps: [
      'Log in to your Joomla administrator panel.',
      'Go to Extensions > Templates > Templates.',
      'Click on your active template, then open index.php.',
      'Paste the script just before the </body> tag.',
      'Click Save and Close. Visit your site to confirm the widget appears.',
    ],
    codeNote: 'Paste this script before </body> in your Joomla template index.php:',
  },
  {
    id: 'weebly',
    name: 'Weebly',
    steps: [
      'Log in to your Weebly account and open your site editor.',
      'Go to Settings > SEO.',
      'Paste the script in the "Footer Code" field.',
      'Click Save, then publish your site.',
    ],
    codeNote: 'Paste this script in Weebly Settings > SEO > Footer Code:',
  },
  {
    id: 'html',
    name: 'HTML / Custom',
    steps: [
      "Open your website's HTML file in a code editor.",
      'Find the closing </body> tag near the bottom of the file.',
      'Paste the script just before </body>.',
      'Save the file and upload it to your web server.',
      'Visit your website to confirm the widget appears in the bottom-right corner.',
    ],
    codeNote: 'Paste this script before </body> in your HTML file:',
  },
]
