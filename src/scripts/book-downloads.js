for(const panel of document.querySelectorAll('[data-download-panel]')){
 const edition=panel.querySelector('[data-edition-select]'),format=panel.querySelector('[data-format-select]'),button=panel.querySelector('[data-download-button]'),status=panel.querySelector('[data-download-status]');
 const resources=[...panel.querySelectorAll('a[data-edition]')];
 panel.querySelector('[data-enhanced-downloads]').hidden=false;
 function update(){
  const resource=resources.find(a=>a.dataset.edition===edition.value && a.dataset.format===format.value);
  button.querySelector('span').textContent=`${panel.dataset.downloadText} ${format.value.toUpperCase()}`;
  button.setAttribute('aria-disabled',String(!resource));
  if(resource){button.href=resource.getAttribute('href');button.setAttribute('download','');}
  else{button.removeAttribute('href');button.removeAttribute('download');}
  status.textContent=resource?`${panel.dataset.availableText} · ${edition.selectedOptions[0].textContent} · ${format.value.toUpperCase()}`:panel.dataset.comingSoonText;
 }
 edition.addEventListener('change',update);format.addEventListener('change',update);update();
}
