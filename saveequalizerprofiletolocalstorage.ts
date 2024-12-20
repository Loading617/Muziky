onMount(() => {
    const savedProfile = localStorage.getItem('equalizerProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      if (typeof parsedProfile === 'string') {
        applyProfile(parsedProfile);
      } else if (Array.isArray(parsedProfile)) {
        customProfile = parsedProfile;
        applyProfile(customProfile);
      }
    }
  });
  
  function saveProfile() {
    const profile = $selectedProfile === 'Custom' ? customProfile : $selectedProfile;
    localStorage.setItem('equalizerProfile', JSON.stringify(profile));
  }  