document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('save-new').addEventListener('click', saveNewUrl);
    document.getElementById('tab-new').addEventListener('click', (event) => openTab(event, 'New'));
    document.getElementById('tab-stored').addEventListener('click', (event) => openTab(event, 'Stored'));
    
    loadStoredUrls();
    document.getElementById('tab-new').click();
  });
  
  function saveNewUrl() {
    const url = document.getElementById('new-url').value;
    const color = document.getElementById('new-color').value;
  
    if (url && color) {
      chrome.storage.sync.get(['urls'], (result) => {
        const urls = result.urls || [];
        urls.push({ url: url, color: color });
        chrome.storage.sync.set({ urls: urls }, () => {
          alert('URL and color saved!');
          loadStoredUrls();
          openTab(null, 'Stored');
        });
      });
    }
  }
  
  function loadStoredUrls() {
    chrome.storage.sync.get(['urls'], (result) => {
      const urlList = document.getElementById('url-list');
      urlList.innerHTML = '';
  
      const urls = result.urls || [];
      urls.forEach((item, index) => {
        const listItem = document.createElement('li');
  
        const urlSpan = document.createElement('span');
        urlSpan.textContent = item.url;
        listItem.appendChild(urlSpan);
  
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = item.color;
        listItem.appendChild(colorInput);
  
        const editButtons = document.createElement('div');
        editButtons.className = 'edit-buttons';
  
        const saveButton = document.createElement('button');
        saveButton.textContent = '✔';
        saveButton.className = 'save-btn';
        saveButton.addEventListener('click', () => updateColor(index, colorInput.value));
        editButtons.appendChild(saveButton);
  
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '✖';
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', () => deleteUrl(index));
        editButtons.appendChild(deleteButton);
  
        listItem.appendChild(editButtons);
        urlList.appendChild(listItem);
      });
    });
  }
  
  function updateColor(index, color) {
    chrome.storage.sync.get(['urls'], (result) => {
      const urls = result.urls || [];
      urls[index].color = color;
      chrome.storage.sync.set({ urls: urls }, () => {
        alert('Color updated!');
        loadStoredUrls();
      });
    });
  }
  
  function deleteUrl(index) {
    chrome.storage.sync.get(['urls'], (result) => {
      const urls = result.urls || [];
      urls.splice(index, 1);
      chrome.storage.sync.set({ urls: urls }, () => {
        alert('URL deleted!');
        loadStoredUrls();
      });
    });
  }
  
  function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
  
    const tablinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
  
    document.getElementById(tabName).style.display = 'block';
    if (evt) {
      evt.currentTarget.className += ' active';
    }
  }
  