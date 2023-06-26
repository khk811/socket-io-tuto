const messageBox = document.querySelector("#messages");
const textBox = document.querySelector("#textBox");
const sendButton = document.querySelector("#msgsendbutton");
const nickname = document.querySelector("#nickName");
const room = document.querySelector("#roomId");
const roomInfoButton = document.querySelector("#RoomInfoButton");

function createMessage(text, ownMessage = false) {
	const messageElement = document.createElement("div");
	messageElement.className = "chat-message";
	const subMesssageElement = document.createElement("div");
	subMesssageElement.className =
		"px-4 py-4 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600";
	if (ownMessage) {
		subMesssageElement.className += " float-right bg-blue-800 text-white";
	}
	subMesssageElement.innerText = text;
	messageElement.appendChild(subMesssageElement);

	messageBox.appendChild(messageElement);
}

function createSysMsg(text, ownMessage = false) {
	const messageElement = document.createElement("div");
	messageElement.className = "chat-message";
	const subMesssageElement = document.createElement("div");
	subMesssageElement.className =
		"px-4 py-4 rounded-lg inline-block rounded-bl-none bg-green-300 text-gray-600";
	if (ownMessage) {
		subMesssageElement.className += " float-right bg-green-300 text-black";
	}
	subMesssageElement.innerText = text;
	messageElement.appendChild(subMesssageElement);

	messageBox.appendChild(messageElement);
}

const socket = io('http://localhost:81');

roomInfoButton.addEventListener("click", () => {
	if (nickname.value != "" && room.value != "") {
		console.log(nickname.value);
		// nickname, room 입력을 전달
		socket.emit('connect-user', nickname.value, room.value);

		// room info form 삭제
		const roomInfoForm = document.querySelector("#RoomInfo");
		roomInfoForm.parentNode.removeChild(roomInfoForm);

		// 입력창 띄우기
		document.getElementById("message-form").style.display = 'block';
	}
})

socket.on('connect', () => {
	// 시스템 메시지 (입장, 퇴장) 출력
	socket.on('sysmsg' + room.value, (enterMsg) => {
		console.log(`1: ${enterMsg}`);
		createSysMsg(enterMsg);
	})

	// // 누군가 메시지 입력시
	console.log(`curr Room: ${room.value}`)
	socket.on(room.value, (message) => {
		console.log(`2: ${message}`);
		createMessage(message);
	})
});

socket.on('sysmsg' + room.value, (enterMsg) => {
	console.log(`3: ${enterMsg}`);
	createSysMsg(enterMsg);
})

socket.on(room.value, (message) => {
	console.log(`4: ${message}`);
	createMessage(message);
})

// socket.on("receive-message", (message) => {
// 	createMessage(message);
// });

sendButton.addEventListener("click", () => {
	if (textBox.value != "") {
		socket.emit("send-message", room.value, nickname.value, textBox.value);
		createMessage(textBox.value, true);
		textBox.value = "";
	}
});
