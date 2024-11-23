import React, { useState, useEffect, useCallback } from 'react';
import { Box, TextField, Button, Typography, LinearProgress, Snackbar, Alert } from '@mui/material';
import axios from '../services/api';
import { CollectionStatus, CollectionStatusLabels } from '../enums';

const App = () => {
  const [stations, setStations] = useState([]);
  const [tempVolumes, setTempVolumes] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchStations = useCallback(async () => {
    setFetchLoading(true);

    try {
      const response = await axios.get(`/station/`);
      setStations(response.data);
      const initialTempVolumes = response.data.reduce((acc, station) => {
        acc[station.id] = '';
        return acc;
      }, {});
      setTempVolumes(initialTempVolumes);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      showSnackbar('Erro ao carregar os dados iniciais.', 'error');
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const handleUpdateVolume = async (id) => {
    const newVolume = tempVolumes[id];
    const station = stations.find((c) => c.id === id);
    if (isNaN(newVolume) || newVolume < 0 || newVolume > station.capacity) {
      showSnackbar(`Por favor, insira um valor entre 0 e ${station.capacity}.`, 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.patch(`/station/${id}/`, { volume: newVolume });
      setStations((prev) =>
        prev.map((station) =>
          station.id === id ? { ...station, volume: newVolume } : station
        )
      );
      setTempVolumes((prev) => ({ ...prev, [id]: '' }));
      showSnackbar('Volume atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar volume:', error);
      showSnackbar('Erro ao atualizar o volume. Tente novamente.', 'error');
      
    } finally {
      await fetchStations();
      setLoading(false);
    }
  };

  const handleUpdateCollectionStatus = async (collectionId, status) => {
    setLoading(true);
    try {
      await axios.patch(`/collection-request/${collectionId}/`, { status });
      setStations((prev) =>
        prev.map((station) =>
          station.collection_request?.id === collectionId
            ? { ...station, collection_request: status === CollectionStatus.CONFIRMED ? null : { ...station.collection_request, status } }
            : station
        )
      );
      showSnackbar(
        status === CollectionStatus.CONFIRMED
          ? 'Coleta confirmada com sucesso!'
          : 'Coleta cancelada com sucesso!'
      );
    } catch (error) {
      console.error('Erro ao atualizar status da coleta:', error);
      showSnackbar('Erro ao atualizar status da coleta. Tente novamente.', 'error');
    } finally {
      await fetchStations();
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Controle de Volumes
      </Typography>

      {fetchLoading ? (
        <Typography variant="body1" color="textSecondary">
          Carregando dados...
        </Typography>
      ) : (
        stations.map((station) => (
          <Box
            key={station.id}
            sx={{
              marginBottom: 4,
              padding: 2,
              border: '1px solid #ccc',
              borderRadius: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6">{station.name}</Typography>
            <TextField
              label="Digite o volume %"
              variant="outlined"
              fullWidth
              type="number"
              value={tempVolumes[station.id] || ''}
              onChange={(e) =>
                setTempVolumes({
                  ...tempVolumes,
                  [station.id]: e.target.value,
                })
              }
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleUpdateVolume(station.id)}
              disabled={loading}
            >
              {loading ? 'Atualizando...' : 'Atualizar Volume'}
            </Button>

            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1">
                Volume Atual: {station.volume}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={parseFloat(station.volume)}
                sx={{ height: 20, borderRadius: 5, marginTop: 1 }}
              />
              <Typography variant="body2" color="textSecondary">
                Pedido de Coleta:{' '}
                {station.collection_request?.id ?  CollectionStatusLabels[CollectionStatus.OPEN] : 'Nenhum'}
              </Typography>
              {station.collection_request?.status === CollectionStatus.OPEN && (
                <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={() =>
                      handleUpdateCollectionStatus(station.collection_request.id, CollectionStatus.CONFIRMED)
                    }
                    disabled={loading}
                  >
                    Confirmar Coleta
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={() =>
                      handleUpdateCollectionStatus(station.collection_request.id, CollectionStatus.CANCELED)
                    }
                    disabled={loading}
                  >
                    Cancelar Coleta
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        ))
      )}
            <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
