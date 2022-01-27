import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useState } from 'react';
import appConfig from '../config.json';
import DeleteIcon from '@material-ui/icons/Delete'
import { IconButton, sendIcon } from '@material-ui/core';

export default function ChatPage() {
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([])

  const handleEnterMessage = () => {
    if (mensagem) {
      setMensagens((mensagens) => [{
        from: 'rhuanbello',
        message: mensagem,
        id: mensagens.length + 1
      }, ...mensagens])
      setMensagem('');
    }
  }

  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://images.unsplash.com/photo-1625632019469-108132f8fc60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80)`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >
          <MessageList 
            mensagens={mensagens} 
            setMensagens={setMensagens}
          />
          <Box
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              autoFocus={!mensagem}
              placeholder="Insira sua mensagem aqui..."
              value={mensagem}
              onChange={(e) => {
                setMensagem(e.target.value)
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleEnterMessage()
                }
              }}
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />

            <Button
              label='Enviar'
              styleSheet={{
                height: '48px',
                marginBottom: '8px',
                backgroundColor: !mensagem ? appConfig.theme.colors.neutrals[800] : appConfig.theme.colors.primary[600],              
              }}
              onClick={() => handleEnterMessage()}
            />
          </Box>
          
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList({ mensagens, setMensagens }) {
  const handleDeleteMessage = (id) => {
    setMensagens([...mensagens].filter(mensagem => mensagem.id !== id))
  }

  return (
    <Box
      tag="ul"
      styleSheet={{
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >

      {mensagens.map(mensagem => (

        <Text
          key={mensagem.id}
          tag="li"
          styleSheet={{
            borderRadius: '5px',
            padding: '6px',
            marginBottom: '12px',
            hover: {
              backgroundColor: appConfig.theme.colors.neutrals[700],
            }
          }}
        >
          <Box
            styleSheet={{
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Image
              styleSheet={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'inline-block',
                marginRight: '8px',
              }}
              src={`https://github.com/vanessametonini.png`}
            />
            <Text tag="strong">
              From {mensagem.from}
            </Text>
            <Text
              styleSheet={{
                fontSize: '10px',
                marginLeft: '8px',
                color: appConfig.theme.colors.neutrals[300],
              }}
              tag="span"
            >
              {(new Date().toLocaleDateString())}
            </Text>
            
            <Box
              styleSheet={{
                marginLeft: 'auto'
              }}
            >
              <IconButton 
                onClick={() => {
                  handleDeleteMessage(mensagem.id)
              }}
              >
                <DeleteIcon color="secondary"/>
              </IconButton>
            </Box>
          </Box>
          {mensagem.message}
        </Text>

      ))}

    </Box>
  )
}