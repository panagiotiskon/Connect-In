import { useState, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import ConnectionAPI from '../api/ConnectionAPI';

// Array keys are used instead of pipe-delimited strings to avoid collisions
// when userId or searchTerm contain the '|' character.
const searchFetcher = async ([, searchTerm, currentUserId]) => {
  if (!searchTerm?.trim() || !currentUserId) return [];
  return await ConnectionAPI.getRegisteredUsers(searchTerm, currentUserId);
};

const connectionsFetcher = async ([, currentUserId]) => {
  if (!currentUserId) return [];
  return await ConnectionAPI.getUserConnections(currentUserId);
};

const pendingFetcher = async ([, currentUserId]) => {
  if (!currentUserId) return [];
  return await ConnectionAPI.getUserPendingConnections(currentUserId);
};

export const useSearchUsers = (currentUserId, debounceDelay = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term. Clears immediately when input is emptied so
  // backspacing to empty transitions to the connections view without delay,
  // matching the behaviour of the explicit clearSearch() action.
  useEffect(() => {
    if (!searchTerm.trim()) {
      setDebouncedSearchTerm('');
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);
    return () => clearTimeout(timer);
  }, [searchTerm, debounceDelay]);

  // Fetch search results — suspended when term is empty or currentUserId is missing
  const {
    data: searchResults = [],
    isLoading: isSearchLoading,
    error: searchError,
    mutate: mutateSearch,
  } = useSWR(
    debouncedSearchTerm.trim() && currentUserId
      ? ['search', debouncedSearchTerm, currentUserId]
      : null,
    searchFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  // Fetch connected users — suspended while searching or when currentUserId is missing
  const {
    data: connectedUsers = [],
    isLoading: isConnectedLoading,
    error: connectionsError,
    mutate: mutateConnections,
  } = useSWR(
    !debouncedSearchTerm.trim() && currentUserId
      ? ['connections', currentUserId]
      : null,
    connectionsFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  // Fetch pending users — suspended while searching or when currentUserId is missing
  const {
    data: pendingUsers = [],
    isLoading: isPendingLoading,
    error: pendingError,
    mutate: mutatePending,
  } = useSWR(
    !debouncedSearchTerm.trim() && currentUserId
      ? ['pending', currentUserId]
      : null,
    pendingFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);

  const isSearchActive = debouncedSearchTerm.trim() !== '';
  // True while the user has typed but the debounce timer hasn't fired yet.
  // Consumers can use this to show a subtle "typing…" indicator.
  const isDebouncing = searchTerm !== debouncedSearchTerm;

  const isLoading = isSearchActive
    ? isSearchLoading
    : isConnectedLoading || isPendingLoading;

  // Combined error for convenience; granular errors also exposed below.
  const error = isSearchActive ? searchError : connectionsError || pendingError;

  // Deduplicate by userId in case the API returns the same user in both
  // connectedUsers and pendingUsers during a state transition.
  const displayedUsers = isSearchActive
    ? searchResults
    : [
        ...new Map(
          [...connectedUsers, ...pendingUsers].map((u) => [u.userId, u])
        ).values(),
      ];

  return {
    searchTerm,
    debouncedSearchTerm,
    displayedUsers,
    connectedUsers,
    pendingUsers,
    isLoading,
    isDebouncing,
    error,
    searchError,
    connectionsError,
    pendingError,
    isSearchActive,
    handleSearchChange,
    clearSearch,
    mutateConnections,
    mutatePending,
    mutateSearch,
  };
};
