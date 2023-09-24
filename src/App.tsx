
import React from 'react';
import './App.scss';
import Chat from './UI/chat'
import { BasicStorage,
    ChatMessage,
    ChatProvider,
    Conversation,
    ConversationId,
    ConversationRole,
    IStorage,
    MessageContentType,
    Participant,
    Presence,
    TypingUsersList,
    UpdateState,
    User,
    UserStatus } from '@chatscope/use-chat';
import {Col, Container, Row} from 'react-bootstrap'
import {ExampleChatService} from "@chatscope/use-chat/dist/examples";
import {AutoDraft} from "@chatscope/use-chat/dist/enums/AutoDraft";
import { nanoid } from 'nanoid';

const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
    return new ExampleChatService(storage, updateState);
};

const akane = new User({
    id: 'Akane',
    presence: new Presence({status: UserStatus.Available, description: ""}),
    firstName: "",
    lastName: "",
    username: 'Akane',
    email: "",
    avatar: '',
    bio: ""
});
const messageIdGenerator = (message: ChatMessage<MessageContentType>) => nanoid();
const groupIdGenerator = () => nanoid();

const akaneStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});
const eliotStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});

function createConversation(id: ConversationId, name: string): Conversation {
    return new Conversation({
        id,
        participants: [
            new Participant({
                id: name,
                role: new ConversationRole([])
            })
        ],
        unreadCounter: 0,
        typingUsers: new TypingUsersList({items: []}),
        draft: ""
    });
}
const chats = [
    {name: "Akane", storage: akaneStorage},
];
const users = [
    {
		name: "Akane",
		avatar: ''
	},
];
chats.forEach(c => {

    users.forEach(u => {
        if (u.name !== c.name) {
            c.storage.addUser(new User({
                id: u.name,
                presence: new Presence({status: UserStatus.Available, description: ""}),
                firstName: "",
                lastName: "",
                username: u.name,
                email: "",
                avatar: u.avatar,
                bio: ""
            }));

            const conversationId = nanoid();

            const myConversation = c.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === u.name) !== "undefined");
            if (!myConversation) {

                c.storage.addConversation(createConversation(conversationId, u.name));

                const chat = chats.find(chat => chat.name === u.name);

                if (chat) {

                    const hisConversation = chat.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === c.name) !== "undefined");
                    if (!hisConversation) {
                        chat.storage.addConversation(createConversation(conversationId, c.name));
                    }

                }

            }

        }
    });

});
const App: React.FC = () => {



	return (
		<div className="h-100 d-flex flex-column overflow-hidden">
		<Container fluid className="p-4 flex-grow-1 position-relative overflow-hidden">
			<Row className="h-50 pb-2 flex-nowrap">
				<Col>
					<ChatProvider serviceFactory={serviceFactory} storage={akaneStorage} config={{
						typingThrottleTime: 250,
						typingDebounceTime: 900,
						debounceTyping: true,
						autoDraft: AutoDraft.Save | AutoDraft.Restore
					}}>
						<Chat user={akane}/>
					</ChatProvider>
				</Col>
			</Row>
		{/* < Chat user={akane}/> */}
		</Container>
		</div>
	)
}

export default App;
