<div>
    <h2>Equalizer</h2>
  
    <!-- Dropdown for Equalizer Profiles -->
    <label for="equalizer-profile">Select Profile:</label>
    <select id="equalizer-profile" bind:value={$selectedProfile} on:change={(e) => applyProfile(e.target.value)}>
      {#each Object.keys(equalizerProfiles) as profile}
        <option value={profile}>{profile}</option>
      {/each}
      <option value="Custom">Custom</option>
    </select>
  
    <!-- Sliders for Custom Profile -->
    {#if $selectedProfile === 'Custom'}
      <div>
        {#each frequencies as frequency, index}
          <div>
            <label for={`frequency-${frequency}`}>{frequency} Hz</label>
            <input
              type="range"
              id={`frequency-${frequency}`}
              min="-10"
              max="10"
              step="1"
              value={customProfile[index]}
              on:input={(e) => {
                customProfile[index] = parseFloat(e.target.value);
                applyProfile(customProfile);
              }}
            />
            <span>{customProfile[index]} dB</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
  <!-- Audio Player -->
  <audio bind:this={audioElement} controls>
    <source src="your-audio-file.mp3" type="audio/mp3" />
  </audio>
  