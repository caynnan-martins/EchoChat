import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }: { navigation: any }) {
    const [email, setEmail] = useState(""); // Estado para armazenar o email
    const [senha, setSenha] = useState(""); // Estado para armazenar a senha

    const handleLogin = () => {
        // Aqui você pode enviar os dados para uma API
        // Exemplo: 
        // fetch('URL_DA_API', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ email, senha }),
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log('Success:', data);
        // })
        // .catch((error) => {
        //     console.error('Error:', error);
        // });
    
        // Exibindo um alerta com os dados (apenas para fins de demonstração)
        // Alert.alert("Dados do Login", `Email: ${email}\nSenha: ${senha}`);
    
        const User = {
            id: 1,
            name: "Caynnan Martins",
            avatar: "https://cdn.discordapp.com/attachments/1213611539936976996/1281367777696809010/E31BBA53-9672-49DC-B6C0-C36477A302C9.gif?ex=66f482bc&is=66f3313c&hm=65344f894283f2e98fbb21d2585ebf8af58af5481b7ffe0e1917e423be52014d&",
            verified: true
        };
    
        // Verifique se o email e a senha estão corretos
        if (email === "caynnan666@gmail.com" && senha === '4321zett') {
            // Salve o objeto User no AsyncStorage
            AsyncStorage.setItem('@user_data', JSON.stringify(User))
                .then(() => {
                    navigation.navigate('Home');
                })
                .catch(error => {
                    console.error('Erro ao salvar dados do usuário:', error);
                });
        } else {
            alert("Dados errados!");
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput 
                style={styles.input}
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail} // Atualiza o estado do email
            />
            <TextInput 
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha} // Atualiza o estado da senha
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.link}>Esqueceu a senha?</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.link}>Criar conta</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        height: 50,
        width: '100%',
        maxWidth: 400,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 12,
        width: '100%',
        maxWidth: 400,
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
    },
    link: {
        color: '#007bff',
        textAlign: 'center',
        marginTop: 12,
        fontSize: 16,
    },
});
