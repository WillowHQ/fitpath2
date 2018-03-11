function* ConvoFactory(i) {
  let lastResponse;
  lastResponse = yield `Hi ${i} do you want to do your weekly survey now?`;
  
  if('yes' === lastResponse){
    lastResponse = yield `I'm sorry to hear that, what can I do to help ${i}`;
    if('nothing' === lastResponse){
      yield `Well fuck me then ${i}`;
    } else {
      yield `that's the spirit! ${i}`
    }
  } else if ('happy' === i ) {
    yield "That's great !!";
  }
  else {
    yield "Not sure what to say";
  }
  delete conversationArray[i]; 
  return;
}

const conversationArray = [];

const handleConversation = (sender, message) => {
  if ( !checkForConversation(conversationArray, sender)){
    createNewConversation(conversationArray, sender, message)
  };
  return conversationArray[sender].next(message).value;
};

const createNewConversation = (convosArray, sender, message) => {
  
  convosArray[sender] = ConvoFactory(sender);
};

const checkForConversation = (convosArray, sender) => {
  //check array indicies to see if sender is there 
  return !(convosArray[sender] === undefined)
};

module.exports = handleConversation;

console.log(handleConversation("Thom", "Hi"));
console.log(handleConversation("Steve", "Hi"));
console.log(handleConversation("Thom", "sad"));
console.log(handleConversation("Thom", "nothing"));







