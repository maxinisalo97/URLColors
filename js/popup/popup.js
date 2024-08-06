document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('save-new').addEventListener('click', saveNewUrl);
    loadStoredUrls();
  
    // Tab functionality
    document.querySelectorAll('.tablinks').forEach(button => {
      button.addEventListener('click', (event) => {
        const tabName = event.currentTarget.textContent;
        openTab(event, tabName);
      });
    });
  
    // Open first tab by default
    document.querySelector('.tablinks').click();
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
        colorInput.className = 'editable-input';
        listItem.appendChild(colorInput);
  
        const editButton = document.createElement('button');
        editButton.textContent = '✔';
        editButton.className = 'edit-buttons';
        editButton.addEventListener('click', () => updateColor(index, colorInput.value));
        listItem.appendChild(editButton);
  
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '✖';
        deleteButton.className = 'edit-buttons';
        deleteButton.addEventListener('click', () => deleteUrl(index));
        listItem.appendChild(deleteButton);
  
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
    evt.currentTarget.className += ' active';
  }
  