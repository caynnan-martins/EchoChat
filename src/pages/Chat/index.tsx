import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
    text: string;
    date: string;
}

interface User {
    name: string;
    avatar: string;
    verified: boolean;
}

interface ChatProps {
    route: {
        params: {
            userName: string;
            userAvatar: string;
            userVerified: boolean;
        };
    };
}

const Chat: React.FC<ChatProps> = ({ route }) => {
    const { userName, userAvatar, userVerified } = route.params;
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Carregar mensagens do AsyncStorage ao montar o componente
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const storedMessages = await AsyncStorage.getItem(userName);
                if (storedMessages) {
                    const parsedMessages: Message[] = JSON.parse(storedMessages);
                    setMessages(parsedMessages);
                }
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        };

        loadMessages();
    }, [userName]);

    // Carregar dados do usuário do AsyncStorage
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('@user_data');
                const userData = jsonValue != null ? JSON.parse(jsonValue) : null;
                setUser(userData);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Enviar mensagem e salvar no AsyncStorage
    const handleSendMessage = async () => {
        if (input.trim()) {
            const newMessage: Message = { text: input, date: new Date().toISOString() };
            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);
            setInput('');

            try {
                await AsyncStorage.setItem(userName, JSON.stringify(updatedMessages));
            } catch (error) {
                console.error('Error saving messages:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Avatar source={{ uri: userAvatar }} rounded size="medium" />
                <Text style={styles.headerTitle}>
                    {userName}
                    {userVerified && <Ionicons name="checkmark-circle" size={20} color="green" />}
                </Text>
            </View>

            {/* Message List */}
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <View style={styles.userProContainer}>
                            <Avatar
                                source={{ uri: user?.avatar }} // Usando o operador de encadeamento opcional
                                rounded
                                size="medium"
                            />
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{user?.name}</Text>
                                <Text style={styles.message}>{item.text}</Text>
                                <Text style={styles.date}>{item.date}</Text>
                            </View>
                        </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.messageList}
            />

            {/* Input Field */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua mensagem..."
                    value={input}
                    onChangeText={setInput}
                />
                <Button title="Enviar" onPress={handleSendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 10,
    },
    headerTitle: {
        fontSize: 20,
        marginLeft: 10,
    },
    messageContainer: {
        flexDirection: 'column',
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
    },
    userProContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userInfo: {
        marginLeft: 4,
    },
    userName: {
        fontWeight: 'bold',
    },
    message: {
        fontSize: 16,
        marginTop: 2,
    },
    date: {
        fontSize: 12,
        color: '#888888',
    },
    messageList: {
        paddingBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
    },
});

export default Chat;
