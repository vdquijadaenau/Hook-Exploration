function useSsr() {
  const isDOM = typeof window !== 'undefined' && window.document && window.document.documentElement;

  return { isBrower: isDOM, isServer: !isDOM };
}

export default useSsr;
