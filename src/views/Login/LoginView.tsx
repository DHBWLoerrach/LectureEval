import { useCallback, useState } from 'react'
import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import { Button, Card, TextInput } from 'react-native-paper'
import HeaderImage from '~/../assets/header.png'
import Link from '~/components/Link'
import SelectMenu from '~/components/SelectMenu'
import { colors } from '~/styles/colors'
import { useLoginLogic } from '~/views/Login/hooks/useLoginLogic'

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'flex-end',
        display: 'flex',
        marginRight: 30,
    },
    card: {
        margin: 30,
    },
    cardContent: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
    },
    headerText: {
        color: colors.white,
        fontSize: 36,
        fontWeight: 'bold',
    },
    image: {
        alignItems: 'center',
        display: 'flex',
        height: 250,
        justifyContent: 'center',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
        padding: 30,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: `${colors.black}60`,
    },
})

// TODO move to database
const locations = ['DHBW Lörrach', 'DHBW Stuttgart', '...']

const LoginView = () => {
    const [location, setLocation] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()

    const { login } = useLoginLogic()

    const onLoginPressed = useCallback(() => {
        // TODO Check for valid Email
        if (!email || email.trim().length === 0) return

        if (!password || password.trim().length === 0) return

        login({ email, password })
    }, [login, email, password])

    return (
        <View>
            <ImageBackground
                style={styles.image}
                source={HeaderImage}
                resizeMode='cover'
            >
                <View style={styles.overlay} />
                <Text style={styles.headerText}>Anmelden</Text>
            </ImageBackground>
            <View style={styles.main}>
                <SelectMenu
                    label='Standort'
                    value={location}
                    options={locations}
                    onChange={(text) => setLocation(text)}
                />
                <TextInput
                    label='E-Mail Adresse'
                    value={email}
                    mode='outlined'
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    label='Passwort'
                    value={password}
                    mode='outlined'
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    mode='contained'
                    onPress={onLoginPressed}
                >
                    <Text>Anmelden</Text>
                </Button>
            </View>
            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <Link href='https://dhbw-loerrach.de/impressum'>
                        <Text>Impressum</Text>
                    </Link>
                    <Text>|</Text>
                    <Link href='https://dhbw-loerrach.de/datenschutz'>
                        <Text>Datenschutz</Text>
                    </Link>
                </Card.Content>
            </Card>
        </View>
    )
}

export default LoginView
