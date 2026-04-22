/**
 * MockDomainBootstrap
 *
 * Carthage equivalent of MockAuthBootstrap. Pre-populates the Jotai atoms
 * that drive the entire Carthage app: program owner, domain services provider,
 * and their IDs.
 *
 * In production, these atoms are populated by useServicesProviders() which
 * fetches from the API based on hostname. In the prototype, we seed them
 * directly so the entire component tree has the data it needs immediately.
 *
 * NOTE: We use @carthage/ prefixed imports because these shell files live
 * in the prototype project, not in apps/carthage/src. The scoped alias
 * plugin only activates for files inside CARTHAGE_SRC.
 */

import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

import type { ReactNode } from 'react';

import {
  domainsServicesProviderIdAtom,
  domainsServicesProviderAtom,
} from '@carthage/common/atoms/servicesProviders/domainsServicesProviderAtoms';
import {
  programOwnerServicesProviderAtom,
} from '@carthage/common/atoms/servicesProviders/programOwnerServicesProviderAtoms';

import { MOCK_PROGRAM_OWNER, MOCK_DOMAIN_SP } from '../../mocks/data/domainConfig';

/**
 * Seeds Jotai atoms with mock domain config so Carthage components
 * can read services provider data without waiting for API calls.
 */
function DomainAtomSeeder(): null {
  const setDomainsServicesProviderId = useSetAtom(domainsServicesProviderIdAtom);
  const setDomainsServicesProvider = useSetAtom(domainsServicesProviderAtom);
  const setProgramOwnerServicesProvider = useSetAtom(programOwnerServicesProviderAtom);

  useEffect(() => {
    setProgramOwnerServicesProvider(MOCK_PROGRAM_OWNER as never);
    setDomainsServicesProviderId(MOCK_DOMAIN_SP.id);
    setDomainsServicesProvider(MOCK_DOMAIN_SP as never);
  }, [setDomainsServicesProviderId, setDomainsServicesProvider, setProgramOwnerServicesProvider]);

  return null;
}

export function MockDomainBootstrap({ children }: { children: ReactNode }): ReactNode {
  return (
    <>
      <DomainAtomSeeder />
      {children}
    </>
  );
}
