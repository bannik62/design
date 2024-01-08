etoilebtn.onmouseover = () => {
  const etoileElement = document.getElementById('etoile');
  etoileElement.classList.remove('hidden');
};

etoilebtn.onmouseout =() =>{
    const etoileElement = document.getElementById('etoile');
  etoileElement.classList.add('hidden');
}