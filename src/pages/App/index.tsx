import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/types'; // Importando os tipos
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface para os dados do usuário
interface User {
    name: string;
    avatar: string;
    verified: boolean;
}

// Dados iniciais dos contatos
const initialContacts = [
    { id: '1', name: 'Alice', avatar: 'https://i.pravatar.cc/300?img=1', verified: false },
    { id: '2', name: 'Bob', avatar: 'https://i.pravatar.cc/300?img=2', verified: false },
    { id: '3', name: 'Charlie', avatar: 'https://i.pravatar.cc/300?img=3', verified: true },
    { id: '4', name: 'Diana', avatar: 'https://i.pravatar.cc/300?img=4', verified: false },
    { id: '5', name: 'Caynnan Martins', avatar: 'https://cdn.discordapp.com/attachments/1213611539936976996/1281367777696809010/E31BBA53-9672-49DC-B6C0-C36477A302C9.gif?ex=66f482bc&is=66f3313c&hm=65344f894283f2e98fbb21d2585ebf8af58af5481b7ffe0e1917e423be52014d&', verified: true },
];

const Home = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleUserPress = (userName: string, userAvatar: string, userVerified: boolean) => {
        navigation.navigate('Chat', { userName, userAvatar, userVerified });
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleUserPress(item.name, item.avatar, item.verified)}
        >
            <Avatar source={{ uri: item.avatar }} rounded size="medium" />
            <Text style={styles.contactName}>{item.name}</Text>
            {item.verified && <Ionicons name="checkmark-circle" size={20} color="green" style={styles.checkmark} />}
        </TouchableOpacity>
    );

    // Definindo o tipo do estado user
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Busca os dados do usuário no AsyncStorage
                const jsonValue = await AsyncStorage.getItem('@user_data');
                const userData = jsonValue != null ? JSON.parse(jsonValue) : null;

                // Atualiza o estado com os dados do usuário
                setUser(userData);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            } finally {
                setLoading(false); // Para de carregar
            }
        };

        fetchUserData();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleModal} style={styles.menuButton}>
                    <Ionicons name="menu" size={30} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Contatos</Text>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.sidebar}>
                        <View style={styles.userInfoContainer}>
                            <Avatar
                                source={{ uri: user?.avatar }} // Usando o operador de encadeamento opcional
                                rounded
                                size="large"
                            />
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>
                                    {user?.name} {/* Usando o operador de encadeamento opcional */}
                                    {user?.verified && <Ionicons name="checkmark-circle" size={20} color="green" style={styles.checkmark} />}
                                </Text>
                                <Text style={styles.userNumber}>+55 17 99270-0548</Text>
                            </View>
                        </View>
                        <Text style={styles.sidebarTitle}>Menu</Text>
                        <TouchableOpacity style={styles.sidebarItem}>
                            <Text style={styles.sidebarItemText}>Meu Perfil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sidebarItem}>
                            <Text style={styles.sidebarItemText}>Novo Grupo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sidebarItem}>
                            <Text style={styles.sidebarItemText}>Contatos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sidebarItem}>
                            <Text style={styles.sidebarItemText}>Mensagens Salvas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sidebarItem}>
                            <Text style={styles.sidebarItemText}>Configurações</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <FlatList
                data={initialContacts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                style={styles.contactList}
            />
        </View>
    );
};

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#6200ee',
        padding: 16,   
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    contactList: {
        marginTop: 10,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        marginVertical: 5,
        borderRadius: 8,
        elevation: 2,
    },
    contactName: {
        marginLeft: 10,
        fontSize: 16,
    },
    checkmark: {
        marginLeft: 'auto',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sidebar: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    userInfo: {
        marginLeft: 10,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userNumber: {
        fontSize: 14,
        color: '#666',
    },
    sidebarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sidebarItem: {
        paddingVertical: 10,
    },
    sidebarItemText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#6200ee',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Home;
