import {Event} from '@prisma/client';
import ReactDOM from 'react-dom/server';
import {CardBase} from '../components/Card/CardBase/CardBase';

export function createEventSubscribeEmailTemplate(event: Event) {
  return `
  <!DOCTYPE html>
  <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
    <meta charset="utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <style>
      td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
    </style>
    <![endif]-->
    
      <title>Confirm your email address</title>
    <style>/* Tailwind CSS components */
  /**
   * @import here any custom CSS components - that is, CSS that
   * you'd want loaded before the Tailwind utilities, so the
   * utilities can still override them.
  */
  /* Tailwind CSS utility classes */
  .absolute {
    position: absolute !important;
  }
  .m-0 {
    margin: 0 !important;
  }
  .mb-6 {
    margin-bottom: 24px !important;
  }
  .mb-4 {
    margin-bottom: 16px !important;
  }
  .mb-1 {
    margin-bottom: 4px !important;
  }
  .block {
    display: block !important;
  }
  .inline-block {
    display: inline-block !important;
  }
  .table {
    display: table !important;
  }
  .hidden {
    display: none !important;
  }
  .h-px {
    height: 1px !important;
  }
  .h-12 {
    height: 48px !important;
  }
  .h-8 {
    height: 32px !important;
  }
  .h-16 {
    height: 64px !important;
  }
  .w-full {
    width: 100% !important;
  }
  .w-150 {
    width: 600px !important;
  }
  .w-12 {
    width: 48px !important;
  }
  .w-1-2 {
    width: 50% !important;
  }
  .max-w-full {
    max-width: 100% !important;
  }
  .cursor-default {
    cursor: default !important;
  }
  .rounded-xl {
    border-radius: 12px !important;
  }
  .rounded {
    border-radius: 4px !important;
  }
  .bg-slate-50 {
    background-color: #f8fafc !important;
  }
  .bg-white {
    background-color: #fff !important;
  }
  .bg-indigo-700 {
    background-color: #4338ca !important;
  }
  .bg-slate-200 {
    background-color: #e2e8f0 !important;
  }
  .bg-indigo-800 {
    background-color: #3730a3 !important;
  }
  .bg-slate-300 {
    background-color: #cbd5e1 !important;
  }
  .bg-cover {
    background-size: cover !important;
  }
  .bg-top {
    background-position: top !important;
  }
  .bg-no-repeat {
    background-repeat: no-repeat !important;
  }
  .p-12 {
    padding: 48px !important;
  }
  .p-0 {
    padding: 0 !important;
  }
  .p-6 {
    padding: 24px !important;
  }
  .py-3_5 {
    padding-top: 14px !important;
    padding-bottom: 14px !important;
  }
  .px-4 {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .py-3 {
    padding-top: 12px !important;
    padding-bottom: 12px !important;
  }
  .py-8 {
    padding-top: 32px !important;
    padding-bottom: 32px !important;
  }
  .px-6 {
    padding-left: 24px !important;
    padding-right: 24px !important;
  }
  .py-4 {
    padding-top: 16px !important;
    padding-bottom: 16px !important;
  }
  .px-12 {
    padding-left: 48px !important;
    padding-right: 48px !important;
  }
  .py-6 {
    padding-top: 24px !important;
    padding-bottom: 24px !important;
  }
  .pb-8 {
    padding-bottom: 32px !important;
  }
  .pr-4 {
    padding-right: 16px !important;
  }
  .pl-4 {
    padding-left: 16px !important;
  }
  .text-left {
    text-align: left !important;
  }
  .text-center {
    text-align: center !important;
  }
  .align-top {
    vertical-align: top !important;
  }
  .align-middle {
    vertical-align: middle !important;
  }
  .font-sans {
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif !important;
  }
  .text-base {
    font-size: 16px !important;
  }
  .text-2xl {
    font-size: 24px !important;
  }
  .text-xs {
    font-size: 12px !important;
  }
  .text-4xl {
    font-size: 36px !important;
  }
  .text-lg {
    font-size: 18px !important;
  }
  .text-sm {
    font-size: 14px !important;
  }
  .text-xl {
    font-size: 20px !important;
  }
  .font-semibold {
    font-weight: 600 !important;
  }
  .uppercase {
    text-transform: uppercase !important;
  }
  .italic {
    font-style: italic !important;
  }
  .leading-6 {
    line-height: 24px !important;
  }
  .leading-full {
    line-height: 100% !important;
  }
  .leading-px {
    line-height: 1px !important;
  }
  .leading-16 {
    line-height: 64px !important;
  }
  .tracking-6 {
    letter-spacing: 24px !important;
  }
  .text-gray-800 {
    color: #1f2937 !important;
  }
  .text-black {
    color: #000 !important;
  }
  .text-white {
    color: #fff !important;
  }
  .text-slate-600 {
    color: #475569 !important;
  }
  .text-indigo-700 {
    color: #4338ca !important;
  }
  .text-slate-500 {
    color: #64748b !important;
  }
  .text-slate-700 {
    color: #334155 !important;
  }
  .mso-text-raise-7_5 {
    mso-text-raise: 30px;
  }
  .mso-text-raise-7 {
    mso-text-raise: 28px;
  }
  .mso-text-raise-4 {
    mso-text-raise: 16px;
  }
  .shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1) !important;
  }
  .shadow-sm {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  }
  .border-0 {
    border: 0;
  }
  .text-decoration-none {
    text-decoration: none;
  }
  .word-break-break-word {
    word-break: break-word;
  }
  .-webkit-font-smoothing-antialiased {
    -webkit-font-smoothing: antialiased;
  }
  /* Your custom utility classes */
  /*
   * Here is where you can define your custom utility classes.
   *
   * We wrap them in the 'utilities' @layer directive, so
   * that Tailwind moves them to the correct location.
   *
   * More info:
   * https://tailwindcss.com/docs/functions-and-directives#layer
  */
  :root {
    color-scheme: light dark;
  }
  .hover-bg-indigo-500:hover {
    background-color: #6366f1 !important;
  }
  .hover-bg-indigo-700:hover {
    background-color: #4338ca !important;
  }
  .hover-text-indigo-500:hover {
    color: #6366f1 !important;
  }
  .hover-text-decoration-underline:hover {
    text-decoration: underline;
  }
  @media (max-width: 600px) {
    .sm-inline-block {
      display: inline-block !important;
    }
    .sm-h-8 {
      height: 32px !important;
    }
    .sm-w-full {
      width: 100% !important;
    }
    .sm-w-6 {
      width: 24px !important;
    }
    .sm-py-8 {
      padding-top: 32px !important;
      padding-bottom: 32px !important;
    }
    .sm-px-6 {
      padding-left: 24px !important;
      padding-right: 24px !important;
    }
    .sm-px-4 {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }
    .sm-px-0 {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .sm-pb-8 {
      padding-bottom: 32px !important;
    }
    .sm-text-3xl {
      font-size: 30px !important;
    }
    .sm-leading-10 {
      line-height: 40px !important;
    }
    .sm-leading-8 {
      line-height: 32px !important;
    }
  }</style>
    
  </head>
  <body class="m-0 p-0 w-full word-break-break-word -webkit-font-smoothing-antialiased bg-slate-50">
    
      <div class="hidden">
        Please confirm your email address in order to activate your account
        &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; 
      </div>
    <div role="article" aria-roledescription="email" aria-label="Confirm your email address" lang="en">
      
      <table class="w-full font-sans" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" class="bg-slate-50">
            <table class="w-150 sm-w-full" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td class="p-12 sm-py-8 sm-px-6 text-center">
                  <a href="https://wannago.app">
                    <img src="images/logo.png" width="100" alt="Maizzle" class="max-w-full align-middle border-0">
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center" class="sm-px-6">
                  <table class="w-full" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td class="p-12 sm-px-6 bg-white text-gray-800 text-base text-left leading-6 rounded-xl shadow-md">
                        <p>
                          You've been invited to:
                        </p>
                        <p class="text-2xl text-black font-semibold m-0 mb-6">
                          [[event.name]]
                        </p>
                        <p class="m-0 mb-6">
                          [[event.description]]
                        </p>
                        <div class="leading-full">
                          <a href="[[event.url]]" class="inline-block py-3_5 px-4 rounded text-base font-semibold text-center text-decoration-none text-white bg-indigo-700 hover-bg-indigo-500">
                            <!--[if mso]>
                              <i class="tracking-6 -mso-font-width-full mso-text-raise-7_5">&#8202;</i>
                            <![endif]-->
                            <span class="mso-text-raise-4">View event &rarr;</span>
                            <!--[if mso]>
                              <i class="tracking-6 -mso-font-width-full">&#8202;</i>
                            <![endif]-->
                          </a>
                        </div>
                        <table class="w-full" role="separator" cellpadding="0" cellspacing="0">
                          <tr>
                            <td class="py-8">
                              <div class="bg-slate-200 h-px leading-px">&zwnj;</div>
                            </td>
                          </tr>
                        </table>
                        <p class="m-0 mb-4">
                          If you didn't sign up to this event, you can safely ignore this email.
                        </p>
                        <p class="m-0 mb-4">
                          Thanks, <br>WannaGo Team
                        </p>
                      </td>
                    </tr>
                    <tr role="separator">
                      <td class="h-12"></td>
                    </tr>
                    <tr>
                      <td class="text-center text-slate-600 text-xs px-6">
                        <p class="m-0 mb-4">
                          Powered by WannaGo
                        </p>
                        <p class="cursor-default">
                          <a href="https://wannago.app" class="text-indigo-700 text-decoration-none hover-text-decoration-underline">Website</a>
                          &bull;
                          <a href="https://twitter.com/wannago" class="text-indigo-700 text-decoration-none hover-text-decoration-underline">Twitter</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    
    </div>
  </body>
  </html> 
  `
    .replace('[[event.name]]', event.title)
    .replace('[[event.description]]', event.description);
}
