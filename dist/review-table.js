const foodDialog=document.querySelector('#food-lightbox');
document.querySelectorAll('.review-table [data-image]').forEach(button=>button.addEventListener('click',()=>{const image=foodDialog.querySelector('img');image.src=button.dataset.image;image.alt=button.dataset.caption;foodDialog.querySelector('p').textContent=button.dataset.caption;foodDialog.showModal()}));
foodDialog.querySelector('button').addEventListener('click',()=>foodDialog.close());foodDialog.addEventListener('click',event=>{if(event.target===foodDialog)foodDialog.close()});
