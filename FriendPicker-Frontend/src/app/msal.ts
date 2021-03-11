import { MsalInterceptorConfiguration } from "@azure/msal-angular";
import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  PublicClientApplication,
} from "@azure/msal-browser";
import { environment } from "src/environments/environment";

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.aadClientId,
      authority: `https://login.microsoftonline.com/${environment.aadTenantId}`,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/', [
    'user.read',
    'User.ReadBasic.All',
  ]);

  protectedResourceMap.set('http://localhost:5000/api', [
    'api://d7c580c4-6676-47ab-bb5b-97e9cae62354/Write',
    'api://d7c580c4-6676-47ab-bb5b-97e9cae62354/Read',
  ]);

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap,
  };
}