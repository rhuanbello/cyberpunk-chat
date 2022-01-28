import {
  Box,
  Button,
  Text,
  TextField,
  Image
} from '@skynexui/components'
import { useEffect, useState } from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';

function Titulo(props) {
  const Tag = props.tag || 'h1';
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals['000']};
          font-size: 24px;
          font-weight: 600;

        }
      `}</style>

    </>
  )

}

export default function PaginaInicial() {
  const [username, setUsername] = useState('');
  const [warning, setWarning] = useState(false);
  const route = useRouter();

  const handleEnterChat = () => {
    if (username.length > 2) {
      route.push('/chat')
    } else {
      setWarning(true)
    }
  }

  return (
    <>
      <Box
        styleSheet={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80)',
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover'
        }}
      >
        <Box
          styleSheet={{
            position: 'relative', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            width: '100%', maxWidth: '700px',
            borderRadius: '5px', padding: '32px', margin: '16px',
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            background: 'rgba( 255, 255, 255, 0.3 )',
            boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
            backdropFilter: 'blur( 3px )',
            borderRadius: '10px',
            border: '1px solid rgba( 255, 255, 255, 0.18 )',
          }}
        >
          <Box
            as="form"
            onSubmit={(e) => {
              e.preventDefault()
              handleEnterChat()
            }}
            styleSheet={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
            }}
          >
            <Titulo tag="h2">Welcome to Night City</Titulo>
            <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
              {appConfig.name}
            </Text>

            <TextField
              fullWidth
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setWarning(false)
              }}
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />
            <Button
              type='submit'
              label='Login'
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.neutrals['300'],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
            {warning && (
              <Box as="p"
                styleSheet={{
                  position: 'absolute',
                  bottom: '18%',
                  left: '5%',
                  fontSize: '14px',
                  color: appConfig.theme.colors.neutrals["000"],
                }}>
                {(username.length > 0 && username.length <= 2)  ? 'Quantidade de caracteres inválida.' : 'Informe um nome de usuário.'}
              </Box>
            )}
          </Box>

          <Box
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '200px',
              padding: '16px',
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: '1px solid',
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: '10px',
              flex: 1,
              minHeight: '240px',
            }}
          >
            {username.length > 2 && (
              <>
                <Image
                  styleSheet={{
                    borderRadius: '50%',
                    marginBottom: '16px',
                    display: username.length > 2 ? 'block' : 'none',
                  }}
                  src={`https://github.com/${username}.png`}
                />
                <Text
                  variant="body4"
                  styleSheet={{
                    color: appConfig.theme.colors.neutrals[200],
                    backgroundColor: appConfig.theme.colors.neutrals[900],
                    padding: '3px 10px',
                    borderRadius: '1000px',
                    display: username.length > 2 ? 'block' : 'none',
                  }}
                >
                  {username}
                </Text>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
