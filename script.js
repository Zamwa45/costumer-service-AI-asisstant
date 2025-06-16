// Initialize the current theme (light by default)
let isDarkTheme = false;
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Toggle between light and dark themes
themeToggle.addEventListener('click', () => {
  isDarkTheme = !isDarkTheme;
  if (isDarkTheme) {
    body.classList.add('dark-theme');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    body.classList.remove('dark-theme');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
});

// Handle Enter key press in the input field
const userInput = document.getElementById('user-input');
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Implement clear chat functionality
const clearChatButton = document.getElementById('clear-chat');
clearChatButton.addEventListener('click', () => {
  const messagesContainer = document.getElementById('messages');
  
  // Keep only the first greeting message
  while (messagesContainer.children.length > 1) {
    messagesContainer.removeChild(messagesContainer.lastChild);
  }
});

// Show typing indicator
function showTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  typingIndicator.style.display = 'flex';
  const messagesContainer = document.getElementById('messages');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  typingIndicator.style.display = 'none';
}

// Format current time
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Local database for gym-related questions
const gymQnA = [
  { question: "What are the gym hours?", answer: "The gym is open from 6 AM to 11 PM every day." },
  { question: "کاتەکانی جیم چۆنە", answer: "جیمەکە لە کاتژمێر ٦ی بەیانی تا ١١ی شەو کراوە." },
  { question: "چۆنی", answer: "باشم سوپاس چۆن یارمەتیت بدەم؟" },
  { question: "when do you close", answer: "It depends, but usually we close at 12 PM." },
  { question: "کەی دادەخەن", answer: "بەپێی ڕۆژەکە دەگۆڕێت، بەڵام بەگشتی کاتژمێر ١٢ی شەو دادەخەین." },
  { question: "do you have a place for women", answer: "Yes, and it's separate!" },
  { question: "شوێنتان هەیە بۆ ئافرەتان", answer: "بەڵێ، هۆڵێکی تایبەت و جیاوازمان هەیە بۆ ئافرەتان!" },
  { question: "hi", answer: "Hello! How can I assist you today?" },
  { question: "سڵاو", answer: "سڵاو! ئەمڕۆ چۆن دەتوانم یارمەتیت بدەم؟" },
  { question: "سلاو", answer: "سڵاو! ئەمڕۆ چۆن دەتوانم یارمەتیت بدەم؟" },
  { question: "what's the price of gym for one month?", answer: "For one month it is $50." },
  { question: "نرخی جیم بۆ یەک مانگ چەندە", answer: "بۆ یەک مانگ ٥٠ دۆلارە." },
  { question: "what are this year's offers?", answer: "For the swimming pool: 1 month $20, 3 months $45; For the gym: 1 month $50, 5 months $175." },
  { question: "ئۆفەرەکانتان چین", answer: "بۆ مەلەوانگە: 1 مانگی 20 دۆلار، 3 مانگی 45 دۆلار؛ بۆ فیتنەس: 1 مانگی 50 دۆلار، 5 مانگی 175 دۆلار" },
  { question: "what are the names of the coaches?", answer: "Our coaches are Ahmad, Zamwa, and Mr. Samyar (swimming pool specialist)." },
  { question: "ناوی ڕاهێنەرەکان چین", answer: "ڕاهێنەرەکانمان ئەحمەد، زاموا و بەڕێز سامیار (پسپۆڕی مەلەوانی) ن." },
  { question: "is there a diet kitchen in the gym?", answer: "Yes, we have a diet kitchen and a small play area while you wait for your friend." },
  { question: "چێشتخانەی دایەتتان هەیە لە جیمەکە", answer: "بەڵێ، چێشتخانەی دایەت و شوێنێکی بچوکمان هەیە بۆ کات بەسەربردن کاتێک چاوەڕێی هاوڕێکەت دەکەیت." },
  { question: "where is the gym located?", answer: "The gym is located in front of Gulan Mall, Erbil, Iraq." },
  { question: "ناونیشانی جیمەکە لەکوێیە", answer: "جیمەکەمان بەرامبەر بە گوڵان مۆڵ، هەولێر، عێراقە." },
  { question: "what is the number of the gym?", answer: "Call us at +964 750 077 5909." },
  { question: "ژمارەی تەلەفۆنی جیمەکە چییە", answer: "پەیوەندیمان پێوە بکە لەسەر ٥٩٠٩ ٠٧٧ ٧٥٠ ٩٦٤+" },
  { question: "what is the gym's email?", answer: "Reach us at hulkgym66@gmail.com." },
  { question: "ئیمەیلی جیمەکە چییە", answer: "پەیوەندیمان پێوە بکە لە hulkgym66@gmail.com" },
  { question: "what's the gym's name?", answer: "We're proudly called Hulk Gym!" },
  { question: "ناوی جیمەکە چییە", answer: "بە شانازییەوە ناومان هەڵک جیمە!" },
  { question: "who is the gym's boss?", answer: "Our manager is Zamwa." },
  { question: "بەڕێوەبەری جیمەکە کێیە", answer: "بەڕێوەبەرەکەمان زامواـیە." },
  { question: "thanks", answer: "You're welcome! We're here whenever you need us." },
  { question: "سوپاس", answer: "بە خێر بێیت! ئێمە لێرەین هەر کاتێک پێویستت پێمان بێت." },
  { question: "what are your opening hours?", answer: "We're open daily from 6 AM to 11 PM." },
  { question: "کاتەکانی کردنەوەتان چۆنە", answer: "ڕۆژانە لە کاتژمێر ٦ی بەیانی تا ١١ی شەو کراوەین." },
  { question: "do you offer personal training?", answer: "Yes! Our certified coaches offer personal training at $15/hour." },
  { question: "ڕاهێنانی تایبەتان هەیە", answer: "بەڵێ! ڕاهێنەرە پشتڕاستکراوەکانمان ڕاهێنانی تایبەتی پێشکەش دەکەن بە نرخی ١٥ دۆلار بۆ کاتژمێرێک." },
  { question: "is there a parking space?", answer: "We have free parking for members behind the building." },
  { question: "شوێنی پارکینگتان هەیە", answer: "پارکینگی بەخۆڕایی هەیە بۆ ئەندامان لە پشت بینایەکەوە." },
  { question: "do you have locker rooms?", answer: "Yes, we provide secure lockers and shower facilities." },
  { question: "ژووری لۆکەرتان هەیە", answer: "بەڵێ، لۆکەری ئاسایش و ئامرازەکانی شاوەرمان هەیە." },
  { question: "what's the minimum age requirement?", answer: "Members must be at least 16 years old to join." },
  { question: "کەمترین تەمەن بۆ بەشداریکردن چەندە", answer: "ئەندامان دەبێت بەلایەنی کەمەوە ١٦ ساڵ بن بۆ بەشداریکردن." },
  { question: "which ai you are?", answer: "I'm Zamos, the AI assistant for Hulk Gym!" },
  { question: "تۆ چ جۆرە زیرەکی دەستکردێکیت", answer: "من زاموسم، یاریدەدەری زیرەکی دەستکرد بۆ هەڵک جیم!" },
  { question: "do you have any social media accounts?", answer: "Yes, you can follow us on Instagram @hulkgym66 and Facebook @hulkgym66." },
  { question: "هەژماری سۆشیال میدیاتان هەیە", answer: "بەڵێ، دەتوانیت فۆڵۆمان بکەیت لە ئینستاگرام و فەیسبووک @hulkgym66" },
  { question: "what payment methods do you accept?", answer: "We accept cash, credit cards, and online payments." },
  { question: "چ شێوازی پارەدانێک وەردەگرن", answer: "کاش، کارتی بانکی و پارەدانی ئۆنلاین وەردەگرین." },
  // Developer information
  { question: "who developed you", answer: "I was developed by Zamwa." },
  { question: "who created you", answer: "Zamwa created me as the AI assistant for Hulk Gym." },
  { question: "who made you", answer: "Zamwa developed me to help Hulk Gym customers." },
  { question: "developer", answer: "I was developed by Zamwa." },
  { question: "who is your developer", answer: "Zamwa is my developer." },
  { question: "کێ درووستی کردوویت", answer: "زاموا درووستی کردووم." },
  // Additional Kurdish variations for common phrases
  { question: "سلاو", answer: "سڵاو! ئەمڕۆ چۆن دەتوانم یارمەتیت بدەم؟" },  // Alternative spelling for hello
  { question: "سلام", answer: "سڵاو! ئەمڕۆ چۆن دەتوانم یارمەتیت بدەم؟" },  // Alternative greeting
  { question: "کاتەکانی جیم", answer: "جیمەکە لە کاتژمێر ٦ی بەیانی تا ١١ی شەو کراوە." }, // Shorter form for hours
  { question: "تاوەنشتان", answer: "جیمەکەمان بەرامبەر بە گوڵان مۆڵ، هەولێر، عێراقە." }, // Common misspelling for location
  { question: "نرخ", answer: "بۆ یەک مانگ ٥٠ دۆلارە." }, // Just "price" in Kurdish
  { question: "ژمارە", answer: "پەیوەندیمان پێوە بکە لەسەر ٥٩٠٩ ٠٧٧ ٧٥٠ ٩٦٤+" }, // Just "number" in Kurdish
  { question: "باشی", answer: "باشم سوپاس چۆن یارمەتیت بدەم؟" }, // Variation of "how are you"
  { question: "سلاو", answer: "سڵاو! ئەمڕۆ چۆن دەتوانم یارمەتیت بدەم؟" },
  { question: "سڵاو", answer: "سڵاو! ئەمڕۆ چۆن دەتوانم یارمەتیت بدەم؟" },
  { question: "سلام", answer: "سڵاو! ئەمڕۆ چۆن دەتوانم یارمەتیت بدەم؟" },
  { question: "slaw", answer: "Hi! How can I help you today?" },
  { question: "slaw akay", answer: "Hi! How can I help you today?" },
  { question: "سلاو هاوڕێ", answer: "سڵاو! چۆن دەتوانم یارمەتیت بدەم؟" },
  { question: "باشی", answer: "باشم، سوپاس! چۆن دەتوانم یارمەتیت بدەم؟" },
  { question: "چۆنی", answer: "باشم، سوپاس! چۆن دەتوانم یارمەتیت بدەم؟" },
  { question: "hello", answer: "Hi! How can I help you today?" },
  { question: "hi", answer: "Hi! How can I help you today?" },
  { question: "hey", answer: "Hey! How can I assist you?" },

  // Gym Hours
  { question: "کاتەکانی جیم", answer: "جیمەکە لە کاتژمێر ٦ی بەیانی تا ١١ی شەو کراوە." },
  { question: "کاتەکانی کردنەوە", answer: "جیمەکە لە کاتژمێر ٦ی بەیانی تا ١١ی شەو کراوە." },
  { question: "کاتی جیم", answer: "جیمەکە لە کاتژمێر ٦ی بەیانی تا ١١ی شەو کراوە." },
  { question: "کاتەکانی جیم چۆنە", answer: "جیمەکە لە کاتژمێر ٦ی بەیانی تا ١١ی شەو کراوە." },
  { question: "جیم کام کاتە داکرێتەوە", answer: "جیمەکە لە کاتژمێر ٦ی بەیانی تا ١١ی شەو کراوە." },
  { question: "what time do you open", answer: "We're open daily from 6 AM to 11 PM." },
  { question: "when do you close", answer: "It depends, but usually we close at 12 AM." },
  { question: "کەی دادەخەن", answer: "بەپێی ڕۆژەکە دەگۆڕێت، بەڵام بە گشتی کاتژمێر ١٢ی شەو دادەخەین." },
  { question: "opening hours", answer: "We are open from 6 AM to 11 PM every day." },
  { question: "closing time", answer: "We usually close at 12 AM." },

  // Price
  { question: "نرخی جیم بۆ یەک مانگ چەندە", answer: "بۆ یەک مانگ ٥٠ دۆلارە." },
  { question: "نرخی یەک مانگ", answer: "بۆ یەک مانگ ٥٠ دۆلارە." },
  { question: "چەندە بۆ مانگەکە", answer: "بۆ یەک مانگ ٥٠ دۆلارە." },
  { question: "بۆ مانگێک چەندە", answer: "بۆ یەک مانگ ٥٠ دۆلارە." },
  { question: "نرخەکە چەندە", answer: "بۆ یەک مانگ ٥٠ دۆلارە." },
  { question: "priceaka chand", answer: "بۆ یەک مانگ ٥٠ دۆلارە." },
  { question: "نرخ", answer: "بۆ یەک مانگ ٥٠ دۆلارە." },
  { question: "price", answer: "It's $50 per month." },
  { question: "how much is the membership", answer: "Membership is $50 per month." },

  // Location
  { question: "ناونیشانی جیمەکە لەکوێیە", answer: "جیمەکەمان بەرامبەر بە گوڵان مۆڵ، هەولێر، عێراقە." },
  { question: "شوێنەکە لە کوێیە", answer: "جیمەکەمان بەرامبەر بە گوڵان مۆڵ، هەولێر، عێراقە." },
  { question: "لە کوێن", answer: "جیمەکەمان بەرامبەر بە گوڵان مۆڵ، هەولێر، عێراقە." },
  { question: "locationakat", answer: "جیمەکەمان بەرامبەر بە گوڵان مۆڵ، هەولێر، عێراقە." },
  { question: "تاونشتان", answer: "جیمەکەمان بەرامبەر بە گوڵان مۆڵ، هەولێر، عێراقە." },
  { question: "location", answer: "We're located across from Gulan Mall, Erbil, Iraq." },
  { question: "where are you located", answer: "We're across from Gulan Mall in Erbil." },

  // Phone Number
  { question: "ژمارەی تەلەفۆنی جیمەکە چییە", answer: "پەیوەندیمان پێوە بکە لەسەر ٥٩٠٩ ٠٧٧ ٧٥٠ ٩٦٤+" },
  { question: "ژمارە", answer: "پەیوەندیمان پێوە بکە لەسەر ٥٩٠٩ ٠٧٧ ٧٥٠ ٩٦٤+" },
  { question: "ژمارەکەتان", answer: "پەیوەندیمان پێوە بکە لەسەر ٥٩٠٩ ٠٧٧ ٧٥٠ ٩٦٤+" },
  { question: "شماره", answer: "پەیوەندیمان پێوە بکە لەسەر ٥٩٠٩ ٠٧٧ ٧٥٠ ٩٦٤+" },
  { question: "شماره تلفن", answer: "پەیوەندیمان پێوە بکە لەسەر ٥٩٠٩ ٠٧٧ ٧٥٠ ٩٦٤+" },
  { question: "phone number", answer: "You can call us at +964 750 077 5909." },
  { question: "contact", answer: "You can reach us at +964 750 077 5909." },

  // Coaches
  { question: "ناوی ڕاهێنەرەکان چین", answer: "ڕاهێنەرەکانمان ئەحمەد، زاموا و سامیارن." },
  { question: "ڕاهێنەرەکان", answer: "ڕاهێنەرەکانمان ئەحمەد، زاموا و سامیارن." },
  { question: "کی ڕاهێنەرە", answer: "ڕاهێنەرەکانمان ئەحمەد، زاموا و سامیارن." },
  { question: "coaches", answer: "Our coaches are Ahmed, Zamwa, and Samyar." },
  { question: "who are the trainers", answer: "Ahmed, Zamwa, and Samyar are our certified trainers." },

  // Training & Offers
  { question: "ڕاهێنانی تایبەتان هەیە", answer: "بەڵێ! ڕاهێنەرە پشتڕاستکراوەکانمان ڕاهێنانی تایبەتی پێشکەش دەکەن." },
  { question: "شخصی ترێنەر", answer: "بەڵێ! ڕاهێنانی تایبەتی هەیە." },
  { question: "ئۆفەرەکانتان چین", answer: "ئۆفەری تایبەتەکانمان بۆ مەلەوان و فیتنەس جیاوازن." },
  { question: "ئۆفەر", answer: "ئۆفەری تایبەتەکانمان بۆ مەلەوان و فیتنەس جیاوازن." },
  { question: "do you have personal training", answer: "Yes! We offer personal training with certified coaches." },
  { question: "any offers", answer: "Yes, we have monthly and multi-month discounts." },

  // Facilities
  { question: "چێشتخانەی دایەتتان هەیە", answer: "بەڵێ، چێشتخانەی دایەت و شوێنێکی بچوکمان هەیە بۆ کات بەسەربردن." },
  { question: "چێشتخانەی هەیە", answer: "بەڵێ، چێشتخانەمان هەیە." },
  { question: "شوێن بۆ ئافرەتان", answer: "بەڵێ، هۆڵێکی تایبەت و جیاوازمان هەیە بۆ ئافرەتان!" },
  { question: "پارکینگ هەیە", answer: "پارکینگی بەخۆڕایی هەیە بۆ ئەندامان." },
  { question: "لۆکەر", answer: "بەڵێ، لۆکەری ئاسایش و شاوەرمان هەیە." },
  { question: "locker", answer: "Yes, we have lockers and shower facilities." },
  { question: "do you have parking", answer: "Yes, we offer free parking for members." },
  { question: "is there a cafeteria", answer: "Yes, we have a diet cafeteria and chill area." }
];


// Function to check local database first
function checkLocalDatabase(query) {
  query = query.toLowerCase().trim();
  
  for (let item of gymQnA) {
    if (item.question.toLowerCase().includes(query) || 
        query.includes(item.question.toLowerCase())) {
      return item.answer;
    }
  }
  
  // Check for partial matches or keywords
  for (let item of gymQnA) {
    const keywords = item.question.toLowerCase().split(' ');
    for (let keyword of keywords) {
      if (keyword.length > 3 && query.includes(keyword)) {
        return item.answer;
      }
    }
  }
  
  return null;
}

// Send message function
async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const messageText = userInput.value.trim();
  if (!messageText) return;
  
  // Add user message
  addMessage(messageText, "user");
  userInput.value = "";
  
  // Show typing indicator
  showTypingIndicator();
  
  // First check local database
  const localAnswer = checkLocalDatabase(messageText);
  
  if (localAnswer) {
    // Use local answer if available
    setTimeout(() => {
      hideTypingIndicator();
      addMessage(localAnswer, "ai");
    }, 500);
  } else {
    // If not in local database, use OpenAI API
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": ""
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant for Hulk Gym in Sulaymaniyah, Iraq. The gym offers memberships, swimming pool, and has coaches named Ahmad, Zamwa, and Mr. Samyar. The gym's contact is +964 750 077 5909 and email is welcometogym@gmail.com. Keep answers brief and friendly. If you don't know specific gym information, be honest and helpful. Try to respond in the same language as the user's question."
            },
            {
              role: "user",
              content: messageText
            }
          ],
          max_tokens: 150
        })
      });
      
      const data = await response.json();
      
      // Hide typing indicator
      hideTypingIndicator();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        addMessage(data.choices[0].message.content, "ai");
      } else {
        addMessage("I'm sorry, I couldn't process your request at the moment. Please try again later.", "ai");
      }
    } catch (error) {
      console.error("Error:", error);
      hideTypingIndicator();
      
      // Fallback response
      addMessage("I'm sorry, I'm having trouble connecting right now. For immediate assistance, please call our gym at +964 750 077 5909.", "ai");
    }
  }
}

// Add message to the chat
function addMessage(text, sender) {
  const messagesContainer = document.getElementById("messages");
  
  // Create message container
  const messageContainer = document.createElement("div");
  messageContainer.className = `message-container ${sender}`;
  
  // Create message header
  const messageHeader = document.createElement("div");
  messageHeader.className = "message-header";
  
  // Create avatar
  const avatar = document.createElement("div");
  avatar.className = `avatar ${sender}`;
  
  // Create avatar icon
  const avatarIcon = document.createElement("i");
  avatarIcon.className = sender === "ai" ? "fas fa-robot" : "fas fa-user";
  avatar.appendChild(avatarIcon);
  
  // Create sender name
  const senderName = document.createElement("div");
  senderName.className = "sender-name";
  senderName.textContent = sender === "ai" ? "AI Assistant" : "You";
  
  // Append avatar and sender name to header
  messageHeader.appendChild(avatar);
  messageHeader.appendChild(senderName);
  
  // Create message bubble
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  
  // Format the message with proper paragraphs
  const formattedText = text.split('\n').map(paragraph => {
    if (paragraph.trim()) {
      return `<p>${paragraph}</p>`;
    }
    return '';
  }).join('');
  
  messageDiv.innerHTML = formattedText || `<p>${text}</p>`;
  
  // Create time info with icon
  const messageInfo = document.createElement("div");
  messageInfo.className = `message-info ${sender}`;
  
  const timeIcon = document.createElement("i");
  timeIcon.className = "far fa-clock";
  
  const timeText = document.createElement("span");
  timeText.textContent = getCurrentTime();
  
  messageInfo.appendChild(timeIcon);
  messageInfo.appendChild(timeText);
  
  // Append elements
  messageContainer.appendChild(messageHeader);
  messageContainer.appendChild(messageDiv);
  messageContainer.appendChild(messageInfo);
  messagesContainer.appendChild(messageContainer);
  
  // Add check marks for user messages
  if (sender === "user") {
    const checkIcon = document.createElement("i");
    checkIcon.className = "fas fa-check-double";
    checkIcon.style.marginLeft = "0.5rem";
    messageInfo.appendChild(checkIcon);
  }
  
  // Scroll to the bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add event listeners for feature buttons
document.querySelectorAll('.feature-button').forEach(button => {
  button.addEventListener('click', () => {
    const tooltip = button.getAttribute('data-tooltip');
    addMessage(`The ${tooltip} feature is not available in this demo.`, "ai");
  });
});

// Add event listeners for input action buttons
document.querySelectorAll('.input-action').forEach(button => {
  button.addEventListener('click', () => {
    const tooltip = button.getAttribute('data-tooltip');
    addMessage(`The ${tooltip} feature is not available in this demo.`, "ai");
  });
});

// Add event listener for send button
document.getElementById('send-button').addEventListener('click', sendMessage);