for(const root of document.querySelectorAll('[data-amazon-book]')){
 const panels=[...root.querySelectorAll('[data-amazon-format]')];
 function selectStore(panel,code){
  const links=[...panel.querySelectorAll('[data-store]')];
  const selected=links.find(a=>a.dataset.store===code)??links[0];
  for(const link of links)link.classList.toggle('is-selected',link===selected);
  panel.querySelector('[data-amazon-country]').value=selected.dataset.store;
  panel.querySelector('[data-amazon-buy]').href=selected.href;
 }
 for(const panel of panels){
  const select=panel.querySelector('[data-amazon-country]');
  selectStore(panel,select.value);
  select.addEventListener('change',()=>selectStore(panel,select.value));
  // Store tiles remain ordinary links: clicking opens the requested Amazon page.
 }
 function update(){
  const language=root.querySelector('[name="amazon-language"]:checked').value;
  const format=root.querySelector('[name="amazon-format"]:checked').value;
  for(const edition of root.querySelectorAll('[data-amazon-edition]'))edition.hidden=edition.dataset.amazonEdition!==language;
  for(const panel of panels)panel.hidden=panel.dataset.amazonFormat!==format;
 }
 root.querySelector('[data-amazon-controls]').hidden=false;
 root.classList.add('is-enhanced');
 for(const control of root.querySelectorAll('input[type="radio"]'))control.addEventListener('change',update);
 for(const select of root.querySelectorAll('.amazon-mobile-country'))select.hidden=false;
 update();
}
