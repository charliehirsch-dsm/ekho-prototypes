/**
 * Stub for Carthage @config/environments.
 *
 * In production, getProgramOwnerIdForHostname() resolves the hostname to a
 * program owner ID. In the prototype, we always return the mock program owner
 * ID so the services provider fetch chain works correctly.
 */

import { PRIMARY_SP_ID } from '../../sandbox/fixtures/dealers';

export const getProgramOwnerIdForHostname = (): string => PRIMARY_SP_ID;

export const getGtmIdForHostname = (): string => 'GTM-MOCK';

export const getAppConfig = () => ({
  hostnameToProgramOwnerId: { default: PRIMARY_SP_ID },
  hostnameToCheckoutUrl: { default: 'http://localhost:4100/checkout' },
  hostnameToBuyerPortalUrl: { default: 'http://localhost:4100/account' },
  storageBucket: 'mock-bucket',
  defaultServiceProviderId: PRIMARY_SP_ID,
  logoFilename: 'storeLogo.png',
  hostnameToGtmId: { default: 'GTM-MOCK' },
});

export const getConfigForEnvironment = () => getAppConfig();
export const developmentConfig = getAppConfig();
export const productionConfig = getAppConfig();
export const stagingConfig = getAppConfig();
export const demoConfig = getAppConfig();
