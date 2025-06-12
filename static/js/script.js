const navbarShowBtn = document.querySelector('.navbar-show-btn');
const navbarCollapseDiv = document.querySelector('.navbar-collapse');
const navbarHideBtn = document.querySelector('.navbar-hide-btn');


navbarShowBtn.addEventListener('click', function(){
    navbarCollapseDiv.classList.add('navbar-show');
});

navbarHideBtn.addEventListener('click', function(){
    navbarCollapseDiv.classList.remove('navbar-show');
});

window.addEventListener('resize', changeSearchIcon);
function changeSearchIcon(){
    let winsize = window.matchMedia('(min-width: 1200px)');
    if(winsize.matches){
        document.querySelector('.search-icon img').src="images/search-icon.png";
    }else {
        document.querySelector('.search-icon img').src="images/search-icon-dark.png";
    }
}

changeSearchIcon();

let resizeTimer;
window.addEventListener('resize', () =>{
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer= setTimeout(() =>{
        document.body.classList.remove('resize-animation-stopper');
    },400);
});





// AIzaSyAF2AblLcxRhl0iglcaIe0dU73zskZyrHk










document.addEventListener("DOMContentLoaded", function() {
    const chatbotToggler = document.querySelector('.chatbot-toggler');
    const chatbot = document.querySelector('.chatbot');
    const chatbotClose = document.querySelector('.chatbot-close');
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.querySelector('.chat-input textarea');
    const chatbox = document.querySelector('.chatbox');
  
    chatbotToggler.addEventListener('click', () => {
      chatbot.style.display = 'flex';
    });
  
    chatbotClose.addEventListener('click', () => {
      chatbot.style.display = 'none';
    });
  
    sendBtn.addEventListener('click', () => {
      let userInput = chatInput.value.trim();
      if (userInput) {
        let userMessage = document.createElement('li');
        userMessage.classList.add('chat', 'outgoing');
        userMessage.innerHTML = `<p>${userInput}</p>`;
        chatbox.appendChild(userMessage);
        chatInput.value = '';
        chatbox.scrollTop = chatbox.scrollHeight;
  
        // Simulate a response from the chatbot
        setTimeout(() => {
          let botMessage = document.createElement('li');
          botMessage.classList.add('chat', 'incoming');
          botMessage.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>I'm here to help! How can I assist you further?</p>`;
          chatbox.appendChild(botMessage);
          chatbox.scrollTop = chatbox.scrollHeight;
        }, 1000);
      }
    });
  
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    });
  });
  