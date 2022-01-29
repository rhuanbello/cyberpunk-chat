import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';
import DeleteIcon from '@material-ui/icons/Delete'
import { IconButton, sendIcon } from '@material-ui/core';
import { createClient } from '@supabase/supabase-js';
import { api } from '../api.js'
import Modal from '@mui/material/Modal';
import { useRouter } from 'next/router';

export default function ChatPage({ username }) {
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [githubData, setGithubData] = useState({})

  const supabaseClient = createClient(
    'https://pjcddalbuqnotirmwpej.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyODE1MywiZXhwIjoxOTU4OTA0MTUzfQ.p0NvOU5LN1m1Ii44sFzaZNqfsMe6XVpk5WFkg0n0YY0'
  )

  const getGithubData = (name) => {
    api.get(name)
      .then(({ data }) => {
        const { name, location, url, followers, bio, login } = data;
        const tempGithubData = {
          photo: `https://github.com/${login}.png`,
          name: name,
          location: location,
          url: url,
          followers: followers,
          bio: bio
        }
        getGithubRepos(login, tempGithubData);
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getGithubRepos = (login, tempGithubData) => {
    api.get(login + '/repos')
      .then(({ data }) => {
        setGithubData({
          ...tempGithubData,
          repos: data
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    console.log('GithubData', githubData)
  }, [githubData])


  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const getSupabaseData = () => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setMensagens(data)
      })
  }

  useEffect(() => {
    getSupabaseData()
  }, [mensagens])

  const handleEnterMessage = () => {
    if (mensagem) {
      supabaseClient
        .from('mensagens')
        .insert(
          [
            {
              name: username,
              message: mensagem
            }
          ]
        )
        .then(() => {
          setMensagem('');
        })
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
            setOpenModal={setOpenModal}
            getGithubData={getGithubData}
            username={username}
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
      <Modal
        open={openModal}
        onClose={handleCloseModal}
      >
        <Box>
          <h1>oi</h1>
        </Box>
      </Modal>
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

function MessageList({
  mensagens,
  setOpenModal,
  getGithubData,
  username
}) {

  const supabaseClient = createClient(
    'https://pjcddalbuqnotirmwpej.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyODE1MywiZXhwIjoxOTU4OTA0MTUzfQ.p0NvOU5LN1m1Ii44sFzaZNqfsMe6XVpk5WFkg0n0YY0'
  )

  const handleDeleteMessage = (mensagem) => {
    if (mensagem.name === username) {
      supabaseClient
        .from('mensagens')
        .delete()
        .match({ id: mensagem.id })
        .then((response) => {
          console.log('resposta', response)
        })
    } else {
      // não pode apagar mensagem que não é de seu usuário
    }
  }

  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    timezone: 'America/Sao_Paulo'
  })

  return (
    <Box
      tag="ul"
      styleSheet={{
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
        overflowY: 'scroll'
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
                cursor: 'pointer'
              }}
              src={`https://github.com/${mensagem.name}.png`}
              onClick={() => {
                setOpenModal(true)
                getGithubData(mensagem.name)
              }}
            />
            <Text tag="strong">
              From {mensagem.name}
            </Text>
            <Text
              styleSheet={{
                fontSize: '12px',
                marginLeft: '8px',
                color: appConfig.theme.colors.neutrals[100],
              }}
              tag="span"
            >
              {
                (new Date(mensagem.created_at)
                  .toLocaleDateString('pt-BR', {
                    timezone: 'America/Sao_Paulo'
                  }
                ) === dataAtual && 'Hoje às ' + new Date(mensagem.created_at)
                  .toLocaleTimeString('pt-BR', {
                    timezone: 'America/Sao_Paulo',
                    timeStyle: 'short'
                  }
                  ))
              }

            </Text>

            <Box
              styleSheet={{
                marginLeft: 'auto'
              }}
            >
              <IconButton
                onClick={() => {
                  handleDeleteMessage(mensagem)
                }}
              >
                <DeleteIcon color="secondary" />
              </IconButton>
            </Box>
          </Box>
          {mensagem.message}
        </Text>

      ))}

    </Box>
  )
}