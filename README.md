# Qeen Analytics SDK Integration Guide for Single Page Applications

This guide will help you integrate the Qeen Analytics SDK into your single-page application (SPA). The SDK allows you to track page sessions, content interactions, and custom events in your SPA.

## Table of Contents
- [Qeen Analytics SDK Integration Guide for Single Page Applications](#qeen-analytics-sdk-integration-guide-for-single-page-applications)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Initialization](#initialization)
    - [Parameters](#parameters)
    - [Returned Content](#returned-content)
    - [InteractionEvent Object](#interactionevent-object)
    - [Content Served Flag](#content-served-flag)
    - [Basic Usage Example](#basic-usage-example)
      - [Example with ReactJS](#example-with-reactjs)
  - [Methods and Properties](#methods-and-properties)
  - [Session Management](#session-management)
  - [Definitions of a Product Detail Page](#definitions-of-a-product-detail-page)
  - [Rendering Content Guidelines](#rendering-content-guidelines)
  - [Event Tracking](#event-tracking)
    - [Automatic Events](#automatic-events)
    - [Custom Events](#custom-events)
  - [Best Practices](#best-practices)

## Installation
To install the Qeen Analytics SDK, add the following script tag to your HTML file:
```html
<script src="https://cdn.qeen.ai/analytics-sdk.js"></script>
```

## Initialization
Initializing the SDK is a three-step process:
1. Fetching content and domain configuration from the API.
2. Initializing the page session.
3. Binding custom events.

```js
const pageData = await qeen.fetchQeenContent(qeenDeviceId);

qeen.setContentServed();
qeen.initPageSession(pageData);

qeen.bindClickEvents(new InteractionEvent('ADD_TO_CART', '.add-to-cart-button'));
qeen.bindScrollEvents(new InteractionEvent('SCROLL_DESCRIPTION', '.product-details'));
```

### Parameters
The `fetchQeenContent` function takes a single parameter:
- `qeenDeviceId`: A unique identifier for the user's device. This ID should be generated and stored on the client side.

> [!NOTE]
> The language of the page is determined by the `lang` attribute in the `<html>` tag. The SDK will use this language to fetch content from the API. Make sure to set the `lang` attribute to the correct language code for your page.

### Returned Content
The `fetchQeenContent` function returns optimized content in the `contentSelectors` object where each key is the content selector and the value is the optimized content. This object may be empty if original content is served.
```js
{
  contentSelectors: {
    '.product-details': '<h1>Product Title</h1><p>Product Description</p>',
    '.reviews-section': '<h2>Reviews</h2><ul><li>Review 1</li><li>Review 2</li></ul>'
  },
  contentId: 'optimized_content',
  contentServingId: '1234567890123456'
}
```

### InteractionEvent Object
```js
{
  label: string,
  value: string
}
```
- **label:** A unique identifier for the event.
- **value:** A CSS selector or JS path that targets the element(s) to track.

### Content Served Flag
The `contentServed` flag should be set to `true` after content is fetched and rendered through the `setContentServed` method. This flag is used to determine if content was served to track the effectiveness of the optimized content. If original content is served, set the flag to `false` by calling `resetContentServed`.

### Basic Usage Example
```js
qeen.fetchQeenContent(qeenDeviceId)
  .then((pageData) => {
    // Render your page with optimized content
    renderOptimizedContent(pageData);
    // Set the content served flag if optimized content was rendered
     if (pageData.contentSelectors) {
      qeen.setContentServed();
    }

    // Initialize the page session
    qeen.initPageSession(pageData);

    // Bind custom click and scroll events
    qeen.bindClickEvents(new InteractionEvent('ADD_TO_CART', '.add-to-cart-button'));
    qeen.bindScrollEvents(new InteractionEvent('SCROLL_DESCRIPTION', '.product-details'));
  })
  .catch((error) => {
    // Render your page with original content
    renderOriginalContent();
  });
```

#### Example with ReactJS
```jsx
// PageDataContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const PageDataContext = createContext();
const userDevicId = "dev";
export function usePageData() {
  return useContext(PageDataContext);
}

export function PageDataProvider({ children }) {
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    // Fetch optmized content from localhost in Demo app
    qeen
      .fetchQeenContent(userDevicId)
      .then((fetchedPageData) => {
        setPageData(fetchedPageData);
        qeen.initPageSession(fetchedPageData);
      })
      .catch((error) => {
        console.error(error);
        setPageData(null);
      })
  }, []);

  return (
    <PageDataContext.Provider value={{ pageData }}>
      {children}
    </PageDataContext.Provider>
  );
}
```
```jsx
// Usage in your app (App.jsx)
import { PageDataProvider } from './components/PageDataContext'; // Import the provider

function App() {
  return (
    <PageDataProvider>
      <Routes>
          {/* Your routes and components */}
      </Routes>
    </PageDataProvider>
  );
}

// Child component that uses the fetched data
import { usePageData } from "./PageDataContext"; // Import the custom hook

function ChildComponent() {
  useEffect(() => {
    // Set the content served flag; ideally this should correlate to successful rendering of optimized content
    // if (pageData.contentSelectors) {
    //   qeen.setContentServed();
    // }

    // Bind custom click and scroll events in the child component
    qeen.bindClickEvents(
      [
        new qeen.InteractionEvent('ADD_TO_CART', '.add-to-cart-button'),
        new qeen.InteractionEvent('PRODUCT_ZOOM', '.product-image')
      ]
    );

    qeen.bindScrollEvents(
      [
        new qeen.InteractionEvent('SCROLL_TITLE', '.product-title'),
        new qeen.InteractionEvent('SCROLL_DESC', '.product-description')
      ]
    );
  }, []);
```
```jsx
  // Use the pageData prop as needed
  return (
    <div>
      <h2>Child Component</h2>
        <div>
          {pageData?.contentSelectors?.["elementSelector"] || "originalValue"}
        </div>
    </div>
  );
}
```

## Methods and Properties
The `qeen` namespace provides the following methods and properties:
- **`fetchQeenContent(qeenDeviceId: string): Promise<ContentResponse>`**
   - Fetches optimized content and domain configuration from the API.
   - Returns a promise that resolves to a `ContentResponse` object with the following properties:
     - `qeenDeviceId: string` - The device ID used to fetch content.
     - `analyticsEndpoint: string` - The endpoint for sending analytics data.
     - `projectId: string` - The project ID for the domain.
     - `contentId: string` - The ID of the optimized content.
     - `contentServingId: string` - The ID of the content serving.
     - `isPdp: boolean` - Indicates if the page is a product detail page; determined by the site URL pattern in the site configuration. Please refer to [Definitions of a Product Detail Page](#definitions-of-a-product-detail-page) for more information.
     - `idleTime: number` - The time in milliseconds before a session is considered idle; set in the site configuration.
     - `contentSelectors: { [key: string]: string }` - An object with CSS selectors as keys and optimized content as values.
     - `rawContentSelectors: [ { uid: string, path: string, value: string } ]` - An array of raw content selectors; included for debugging purposes.
- **`initPageSession(pageData: ContentResponse): void`**
   - Initializes the page session with the provided `pageData`.
- **`setContentServed(): void`**
   - Sets the content served flag to `true`.
- **`resetContentServed(): void`**
   - Sets the content served flag to `false`. This method is implicitly called during `fetchQeenContent`.
- **`bindClickEvents(events: InteractionEvent | InteractionEvent[]): void`**
   - Binds custom click events to the specified elements.
- **`bindScrollEvents(events: InteractionEvent | InteractionEvent[]): void`**
   - Binds custom scroll events to the specified elements.
- **`sendCheckoutEvent(currency: string, value: number): void`**
   - Sends a checkout event with the specified currency and value.
- **`randInt(): number`**
   - Convenience function to generate a 16-digit random integer; can be used to generate a device ID.
- **`config: Object`**
   - Configuration object for the SDK; exposed for debugging and testing purposes.
- **`state: Object`**
   - State object for the SDK; exposed for debugging and testing purposes.
- **`InteractionEvent: Class`**
   - Class for defining custom click and scroll events; takes a `label` and `value` as parameters.
- **`InvalidParameterError: Error`**
   - Error that is thrown when an invalid parameter is passed to a function.
- **`AnalyticsEndpointError: Error`**
   - Error that is thrown when the analytics endpoint is not found.
- **`ResponseNotOkError: Error`**
   - Error that is thrown when the response from the API is not OK.
- **`URLContainsNoQeenError: Error`**
   - Error that is thrown when the URL contains `#no-qeen`.

## Session Management
The SDK automatically manages page session ID. When navigating to a new page in your SPA, make sure to call `initPageSession`  again. This will:
1. Signal a `PAGE_EXIT` event for the previous session.
2. Initialize a new session for the current page.

User device ID creation and storage is the responsibility of the application. This ID should be passed to the API when fetching content data.
A random 16-digit integer can be generated using the `randInt` method provided by the SDK.

## Definitions of a Product Detail Page
Within the context of the Qeen Analytics SDK, a product detail page (PDP) is defined as a product page with content generation enabled. If your website serves content in multiple languages, only the products pages in languages with content generation enabled will be considered PDPs. The SDK will consider product pages in other languages as non-product detail pages.
A product detail page is determined by the site URL pattern in the site configuration. If the current page URL matches the pattern, the SDK will consider it a product detail page and optimize content for it assuming the content fetch request is sent with a language that has content generation enabled.

## Rendering Content Guidelines
Optimized content will be served in the `contentSelectors` object; however, there are cases where original content must be rendered instead:
- **User In Original Content Group**: Depending on the original/optimized serving ratio, some users will not receive optimized content.
- **Optimized Content Does Not Exist:** This is due to the optimized content still being generated or reviewed. The content may also be disabled for this page in the dashboard.
- **Non-Product Detail Pages:** The SDK will not optimize content for [non-product detail pages](#definitions-of-a-product-detail-page), but you can still use the SDK for event tracking.
- **URL Contains `#no-qeen`:** If the URL contains `#no-qeen`, the SDK will not fetch optimized content. This can be used for debugging or testing purposes. You are not able to use the SDK for event tracking in this case.
- **General Fetch Error:** If an error occurs during content fetching, no optimized content will be served and analytics will not be tracked.

Refer to the following table for guidelines on rendering content:
| Case                             | Response                                                                                                                   | Content               | Analytics             |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------- | --------------------- |
| Optimized Content Exists         | `contentId`: some meaningful value<br />`contentServingId`: some meaningful value<br />`contentSelectors`: non-empty value | Use Optimized Content | Track Analytics       |
| User In Original Content Group   | `contentId`: `"original"`<br />`contentServingId`: some meaningful value<br />`contentSelectors`: empty                                    | Use Original Content  | Track Analytics       |
| Optimized Content Does Not Exist | `contentId`: `"-"`<br />`contentServingId`: some meaningful value<br />`contentSelectors`: empty                                           | Use Original Content  | Track Analytics       |
| Non-Product Detail Page          | `isPdp`: `false`<br />`contentId`: `"-"`<br />`contentServingId`: `"0"`<br />`contentSelectors`: empty                     | Use Original Content  | Track Analytics       |
| URL Contains `#no-qeen`       | `URLContainsNoQeenError`                                                                                                | Use Original Content  | No Analytics Tracking |
| General Fetch Error              | `ResponseNotOkError`                                                                                                       | Use Original Content  | No Analytics Tracking |

## Event Tracking
### Automatic Events
The SDK automatically tracks the following events:
- **`PAGE_VIEW`:** Fired when a session is initialized regardless if it has content or not.
- **`CONTENT_SERVED`:** Fired when a session is initialized after optimized content is rendered.
- **`TAB_SWITCH`:** Fired when the tab or browser is defocused or refocused with two possible labels: `EXIT` and `RETURN`.
- **`IDLE`:** Fired if a user does nothing on the page and the session exceeds `idleTime`. This will also create a new session. Defocusing the tab for a time longer than `idleTime` will also cause the session to be reset.
- **`PAGE_EXIT`:** Fired when navigating away from a page or closing the browser. Note that most mobile browsers and some frameworks will fire `TAB_SWITCH:EXIT` instead of `PAGE_EXIT`.

### Custom Events
Instead of enabling general click and scroll tracking, you can now define specific elements to track for clicks and scrolls. These are bound to the SDK using the appropriate methods.
- **Click Events:** Use the `bindClickEvents` method to bind custom click events to specific elements on the page. Click events are debounced with a delay of 500ms.
- **Scroll Events:** Use the `bindScrollEvents` method to bind custom scroll events to specific elements on the page. Each scroll event label may only be fired once per page session.
- **Checkout Event:** Use the `sendCheckoutEvent` method to send a checkout event with the specified currency and value. Note that this event can only be sent on non-product detail pages and is not debounced.

## Best Practices
1. Initialization Timing: Always call `initPageSession` after rendering the page content. This ensures accurate tracking of the displayed content.
2. Language Detection: Content fetching relies on the page language; keep the `lang` attribute in the `<html>` accurate to the language of the page.
3. State Consistency: Ensure that you set the content served flag if optimized content was rendered successfully.
4. SPA Navigation: Re-initialize the SDK on every page navigation in your SPA to properly track new sessions and exit events.
5. Custom Event Configuration: Use clear and descriptive labels for your custom events to make analysis easier. Be specific with your CSS selectors to target exactly the elements you want to track. Using IDs or unique classes is recommended; avoid using tag or child selectors. Additionally, make sure to use different class names between product detail pages and non-product detail pages to avoid tracking the same event on both types of pages.
> [!NOTE]  
> `ADD_TO_CART` is a special click label that is used for tracking the ATC rate. It's generally only used on add to cart/buy now buttons on product detail pages.

6. Consistent Naming: Maintain consistency in your naming across different pages and features. This will make it easier to analyze data and create reports.
7. Non-Product Detail Pages: The SDK will automatically detect non-product detail pages and not optimize content for them. You should still call the fetch method to get the domain configuration.
8. Checkout Events: Checkout events are not debounced and can only be sent on non-product detail pages. Make sure to not directly bind checkout events to user interactions and instead only send them on confirmation or completion of a checkout process.

By following these guidelines and best practices, you'll be able to effectively integrate the Qeen Analytics SDK into your single-page application, configure custom click and scroll events precisely, and gather valuable insights about user behavior and content performance.
___
