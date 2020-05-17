
var state = new State()

chrome.browserAction.onClicked.addListener(() => {
  state.toggle()
  return true
})

chrome.tabs.onActivated.addListener(({tabId}) => {
  if(tabId in state.get()){
    state.activeCurrent(tabId)
  } else {
    state.reset()
  }
    return true
})

chrome.tabs.onRemoved.addListener((tabId, {windowId, isClosing}) => {
  if(isClosing){
    state.flushall()
  }
  else{
    state.flush(tabId)
  }
})

function State(){
  var activeState = {
    icon: "icons/active.png",
    active: true
  }

  var inactiveState = {
    icon: "icons/inactive.png",
    active: false
  }

  var state = {
    current: inactiveState
  }

  var setState = function(iconPath, active){
    iconConfig = { path: iconPath }

    chrome.browserAction.setIcon(iconConfig)
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      var tabId = tabs[0].id
      state[tabId] = state.current
      chrome.tabs.sendMessage(tabId, { active });
  
    });
  }

  this.activeCurrent = function(tabId){
    state.current = state[tabId]
    setState(state.current.icon, state.current.active)
  }

  this.active = function(){
    state.current = activeState
    setState(state.current.icon, state.current.active)
  }

  this.inactive = function(){
    state.current = inactiveState
    setState(state.current.icon, state.current.active)
  }

  this.toggle = function(){
    state.current = state.current.active ? inactiveState : activeState
    setState(state.current.icon, state.current.active)
  }

  this.flushall = function(){
    state = {current: inactiveState}
  }

  this.flush = function(tabId){
    delete state[tabId]
  }

  this.reset = function(){
    this.inactive()
  }

  this.get = function(){
    return state
  }
}