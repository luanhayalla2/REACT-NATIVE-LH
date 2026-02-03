import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  getDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
} from '../services/firestoreService';

interface Item {
  id?: string;
  title: string;
  description: string;
}

export default function ListScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Carregar items do Firestore
  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await getDocuments('items');
      setItems(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os items');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Adicionar novo item
  const handleAddItem = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Aviso', 'Preencha todos os campos');
      return;
    }

    try {
      if (editingId) {
        // Atualizar item existente
        await updateDocument('items', editingId, { title, description });
        setEditingId(null);
      } else {
        // Adicionar novo item
        await addDocument('items', { title, description, createdAt: new Date() });
      }
      setTitle('');
      setDescription('');
      loadItems();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o item');
      console.error(error);
    }
  };

  // Deletar item
  const handleDeleteItem = async (id: string) => {
    Alert.alert('Confirmar', 'Deseja deletar este item?', [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Deletar',
        onPress: async () => {
          try {
            await deleteDocument('items', id);
            loadItems();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível deletar o item');
            console.error(error);
          }
        },
      },
    ]);
  };

  // Editar item
  const handleEditItem = (item: Item) => {
    setTitle(item.title);
    setDescription(item.description);
    setEditingId(item.id || null);
  };

  // Cancelar edição
  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setEditingId(null);
  };

  if (loading && items.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciador de Items</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
        />
        <TextInput
          style={[styles.input, styles.textAreaInput]}
          placeholder="Descrição"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          placeholderTextColor="#999"
        />
        <View style={styles.buttonContainer}>
          <Button
            title={editingId ? 'Atualizar' : 'Adicionar'}
            onPress={handleAddItem}
            color="#4CAF50"
          />
          {editingId && (
            <Button title="Cancelar" onPress={handleCancel} color="#f44336" />
          )}
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id || ''}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
            <View style={styles.itemButtons}>
              <TouchableOpacity
                onPress={() => handleEditItem(item)}
                style={[styles.button, styles.editButton]}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteItem(item.id || '')}
                style={[styles.button, styles.deleteButton]}
              >
                <Text style={styles.buttonText}>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum item adicionado</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
  },
  textAreaInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  itemButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
});
