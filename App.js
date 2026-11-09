import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';

const INITIAL_MENU = [
  {
    id: '1',
    name: 'Kalk Bay Calamari Strips',
    description: 'Lightly dusted and deep-fried calamari tubes served with homemade tartar sauce and lemon.',
    price: 135.0,
    course: 'Starter',
    prepTime: 12,
  },
  {
    id: '2',
    name: 'Seafood Platter for One',
    description: 'Grilled hake fillet, 4 king prawns, and creamy garlic mussels served over savory rice.',
    price: 295.0,
    course: 'Main Course',
    prepTime: 25,
  },
  {
    id: '3',
    name: 'Brass Bell Fish & Chips',
    description: 'Traditional beer-battered Cape Hake served with rustic cut chips and mushy peas.',
    price: 165.0,
    course: 'Main Course',
    prepTime: 18,
  },
  {
    id: '4',
    name: 'Traditional Malva Pudding',
    description: 'Warm South African sponge cake drenched in butterscotch sauce, served with vanilla custard.',
    price: 75.0,
    course: 'Dessert',
    prepTime: 10,
  },
];

const COURSES = ['All', 'Starter', 'Main Course', 'Dessert'];

export default function App() {
  const [menuItems, setMenuItems] = useState(INITIAL_MENU);
  const [activeTab, setActiveTab] = useState('menu');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCourse, setFormCourse] = useState('Main Course');
  const [formPrepTime, setFormPrepTime] = useState('');
  const [formError, setFormError] = useState('');

  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('Table 1');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse = selectedCourse === 'All' || item.course === selectedCourse;
      return matchesSearch && matchesCourse;
    });
  }, [menuItems, searchQuery, selectedCourse]);

  const stats = useMemo(() => {
    const totalItems = menuItems.length;
    const totalPrice = menuItems.reduce((acc, curr) => acc + curr.price, 0);
    const avgPrice = totalItems > 0 ? (totalPrice / totalItems).toFixed(2) : '0.00';
    
    const countByCourse = COURSES.filter((c) => c !== 'All').reduce((acc, course) => {
      acc[course] = menuItems.filter((item) => item.course === course).length;
      return acc;
    }, {});

    return { totalItems, avgPrice, countByCourse };
  }, [menuItems]);

  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const vat = subtotal * 0.15;
    const total = subtotal + vat;
    return { subtotal: subtotal.toFixed(2), vat: vat.toFixed(2), total: total.toFixed(2) };
  }, [cart]);

  const openAddItemModal = () => {
    setEditingItemId(null);
    setFormName('');
    setFormDesc('');
    setFormPrice('');
    setFormCourse('Main Course');
    setFormPrepTime('');
    setFormError('');
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item) => {
    setEditingItemId(item.id);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormPrice(item.price.toString());
    setFormCourse(item.course);
    setFormPrepTime(item.prepTime ? item.prepTime.toString() : '');
    setFormError('');
    setIsItemModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!formName.trim() || !formDesc.trim() || !formPrice.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const parsedPrice = parseFloat(formPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('Please enter a valid price greater than R0.');
      return;
    }

    const parsedPrepTime = parseInt(formPrepTime, 10) || 15;

    if (editingItemId) {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingItemId
            ? {
                ...item,
                name: formName.trim(),
                description: formDesc.trim(),
                price: parsedPrice,
                course: formCourse,
                prepTime: parsedPrepTime,
              }
            : item
        )
      );
    } else {
      const newItem = {
        id: Date.now().toString(),
        name: formName.trim(),
        description: formDesc.trim(),
        price: parsedPrice,
        course: formCourse,
        prepTime: parsedPrepTime,
      };
      setMenuItems((prev) => [newItem, ...prev]);
    }

    setIsItemModalOpen(false);
  };

  const handleDeleteItem = (id, name) => {
    Alert.alert(
      'Remove Menu Item',
      `Are you sure you want to remove "${name}" from the menu?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems((prev) => prev.filter((item) => item.id !== id));
            setCart((prev) => prev.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing.quantity === 1) {
        return prev.filter((c) => c.id !== id);
      }
      return prev.map((c) => (c.id === id ? { ...c, quantity: c.quantity - 1 } : c));
    });
  };

  const finalizeOrder = () => {
    setIsCheckoutModalOpen(false);
    setCart([]);
    Alert.alert('Order Placed Successfully', `Order for ${tableNumber} sent to the Kitchen Display System.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>THE BRASS BELL</Text>
          <Text style={styles.headerSubtitle}>Kalk Bay • POS & Menu Manager</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openAddItemModal}>
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'menu' && styles.activeTabItem]}
          onPress={() => setActiveTab('menu')}
        >
          <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>Menu ({menuItems.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'pos' && styles.activeTabItem]}
          onPress={() => setActiveTab('pos')}
        >
          <Text style={[styles.tabText, activeTab === 'pos' && styles.activeTabText]}>
            Active Order ({cart.reduce((a, c) => a + c.quantity, 0)})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'stats' && styles.activeTabItem]}
          onPress={() => setActiveTab('stats')}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>Analytics</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'menu' && (
        <View style={styles.contentContainer}>
          <View style={styles.filterSection}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search dishes or ingredients..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.courseScroll}>
              {COURSES.map((course) => (
                <TouchableOpacity
                  key={course}
                  style={[styles.coursePill, selectedCourse === course && styles.activeCoursePill]}
                  onPress={() => setSelectedCourse(course)}
                >
                  <Text style={[styles.coursePillText, selectedCourse === course && styles.activeCoursePillText]}>
                    {course}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={filteredMenu}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No menu items found.</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.course}</Text>
                  </View>
                  <Text style={styles.priceTag}>R {item.price.toFixed(2)}</Text>
                </View>

                <Text style={styles.dishName}>{item.name}</Text>
                <Text style={styles.dishDesc}>{item.description}</Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.prepTime}>⏱ {item.prepTime || 15} mins prep</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.cartAddButton} onPress={() => addToCart(item)}>
                      <Text style={styles.cartAddText}>+ Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editButton} onPress={() => openEditItemModal(item)}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteItem(item.id, item.name)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {activeTab === 'pos' && (
        <View style={styles.contentContainer}>
          <View style={styles.posHeader}>
            <Text style={styles.sectionTitle}>Table Order Terminal</Text>
            <View style={styles.tableSelector}>
              {['Table 1', 'Table 2', 'Table 3', 'Patio 4'].map((tbl) => (
                <TouchableOpacity
                  key={tbl}
                  style={[styles.tablePill, tableNumber === tbl && styles.activeTablePill]}
                  onPress={() => setTableNumber(tbl)}
                >
                  <Text style={[styles.tablePillText, tableNumber === tbl && styles.activeTablePillText]}>
                    {tbl}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {cart.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No items added to current order.</Text>
              <Text style={styles.emptySubText}>Select "+ Order" on any menu dish to start an active table check.</Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <FlatList
                data={cart}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                  <View style={styles.cartRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cartItemName}>{item.name}</Text>
                      <Text style={styles.cartItemPrice}>R {(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item.id)}>
                        <Text style={styles.qtyBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item)}>
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />

              <View style={styles.checkoutBanner}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal:</Text>
                  <Text style={styles.summaryValue}>R {cartTotals.subtotal}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>VAT (15%):</Text>
                  <Text style={styles.summaryValue}>R {cartTotals.vat}</Text>
                </View>
                <View style={[styles.summaryRow, { marginTop: 6 }]}>
                  <Text style={styles.totalLabel}>Total Due:</Text>
                  <Text style={styles.totalValue}>R {cartTotals.total}</Text>
                </View>

                <TouchableOpacity style={styles.checkoutButton} onPress={() => setIsCheckoutModalOpen(true)}>
                  <Text style={styles.checkoutButtonText}>Send Order to Kitchen • R {cartTotals.total}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      {activeTab === 'stats' && (
        <ScrollView style={styles.contentContainer} contentContainerStyle={{ padding: 16 }}>
          <Text style={styles.sectionTitle}>Menu Overview & Analytics</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalItems}</Text>
              <Text style={styles.statLabel}>Total Dishes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>R {stats.avgPrice}</Text>
              <Text style={styles.statLabel}>Average Price</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Dishes per Course</Text>
          {Object.entries(stats.countByCourse).map(([course, count]) => (
            <View key={course} style={styles.courseStatRow}>
              <Text style={styles.courseStatLabel}>{course}</Text>
              <View style={styles.courseStatBarContainer}>
                <View
                  style={[
                    styles.courseStatBar,
                    {
                      width: stats.totalItems > 0 ? `${(count / stats.totalItems) * 100}%` : '0%',
                    },
                  ]}
                />
              </View>
              <Text style={styles.courseStatCount}>{count} items</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={isItemModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editingItemId ? 'Edit Dish' : 'Add New Dish'}</Text>

            {formError ? <Text style={styles.errorBanner}>{formError}</Text> : null}

            <Text style={styles.inputLabel}>Dish Name *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Seafood Platter"
              placeholderTextColor="#94A3B8"
              value={formName}
              onChangeText={setFormName}
            />

            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.modalInput, { height: 70 }]}
              placeholder="Detailed ingredients and preparation style..."
              placeholderTextColor="#94A3B8"
              multiline
              value={formDesc}
              onChangeText={setFormDesc}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Price (ZAR R) *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="150.00"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={formPrice}
                  onChangeText={setFormPrice}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Prep Time (Mins)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="15"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={formPrepTime}
                  onChangeText={setFormPrepTime}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Course Category</Text>
            <View style={styles.modalCoursePicker}>
              {['Starter', 'Main Course', 'Dessert'].map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.pickerPill, formCourse === c && styles.activePickerPill]}
                  onPress={() => setFormCourse(c)}
                >
                  <Text style={[styles.pickerPillText, formCourse === c && styles.activePickerPillText]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsItemModalOpen(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveItem}>
                <Text style={styles.saveButtonText}>{editingItemId ? 'Update Dish' : 'Save Dish'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isCheckoutModalOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Order ({tableNumber})</Text>
            <Text style={styles.dishDesc}>Please verify order items before sending to kitchen display.</Text>

            <ScrollView style={{ maxHeight: 200, marginVertical: 12 }}>
              {cart.map((item) => (
                <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
                  <Text style={{ color: '#E2E8F0' }}>
                    {item.quantity}x {item.name}
                  </Text>
                  <Text style={{ color: '#0EA5E9', fontWeight: '600' }}>
                    R {(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={{ borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 8, marginBottom: 16 }}>
              <Text style={styles.totalValue}>Total Payable: R {cartTotals.total}</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsCheckoutModalOpen(false)}>
                <Text style={styles.cancelButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={finalizeOrder}>
                <Text style={styles.saveButtonText}>Confirm & Print Ticket</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#38BDF8', letterSpacing: 1 },
  headerSubtitle: { fontSize: 12, color: '#94A3B8' },
  addButton: { backgroundColor: '#0EA5E9', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  tabBar: { flexDirection: 'row', backgroundColor: '#1E293B', borderBottomWidth: 1, borderBottomColor: '#334155' },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTabItem: { borderBottomWidth: 2, borderBottomColor: '#38BDF8' },
  tabText: { color: '#94A3B8', fontWeight: '600', fontSize: 13 },
  activeTabText: { color: '#38BDF8' },
  contentContainer: { flex: 1 },
  filterSection: { padding: 12, backgroundColor: '#0F172A' },
  searchInput: {
    backgroundColor: '#1E293B',
    color: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  courseScroll: { flexDirection: 'row' },
  coursePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeCoursePill: { backgroundColor: '#0EA5E9', borderColor: '#0EA5E9' },
  coursePillText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  activeCoursePillText: { color: '#FFFFFF' },
  listContainer: { padding: 12 },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  badge: { backgroundColor: '#0369A1', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgeText: { color: '#E0F2FE', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  priceTag: { color: '#38BDF8', fontSize: 16, fontWeight: '800' },
  dishName: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 4 },
  dishDesc: { fontSize: 13, color: '#94A3B8', marginBottom: 12, lineHeight: 18 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  prepTime: { fontSize: 11, color: '#64748B' },
  actionButtons: { flexDirection: 'row', gap: 8 },
  cartAddButton: { backgroundColor: '#16A34A', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  cartAddText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  editButton: { backgroundColor: '#334155', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  editButtonText: { color: '#E2E8F0', fontSize: 12, fontWeight: '600' },
  deleteButton: { backgroundColor: '#991B1B', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  deleteButtonText: { color: '#FECACA', fontSize: 12, fontWeight: '600' },
  emptyState: { padding: 32, alignItems: 'center' },
  emptyText: { color: '#94A3B8', fontSize: 15, fontWeight: '600' },
  emptySubText: { color: '#64748B', fontSize: 13, textAlign: 'center', marginTop: 4 },
  posHeader: { padding: 12, backgroundColor: '#1E293B', borderBottomWidth: 1, borderBottomColor: '#334155' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 8 },
  tableSelector: { flexDirection: 'row', gap: 8 },
  tablePill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#334155' },
  activeTablePill: { backgroundColor: '#0284C7', borderColor: '#0284C7' },
  tablePillText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  activeTablePillText: { color: '#FFFFFF' },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  cartItemName: { color: '#F8FAFC', fontWeight: '600', fontSize: 14 },
  cartItemPrice: { color: '#38BDF8', fontSize: 13, fontWeight: '700' },
  quantityControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: 6, padding: 2 },
  qtyBtn: { paddingHorizontal: 10, paddingVertical: 4 },
  qtyBtnText: { color: '#38BDF8', fontWeight: '800', fontSize: 16 },
  qtyText: { color: '#F8FAFC', fontWeight: '700', paddingHorizontal: 8 },
  checkoutBanner: { backgroundColor: '#1E293B', padding: 16, borderTopWidth: 1, borderTopColor: '#334155' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryLabel: { color: '#94A3B8', fontSize: 13 },
  summaryValue: { color: '#E2E8F0', fontSize: 13, fontWeight: '600' },
  totalLabel: { color: '#F8FAFC', fontSize: 16, fontWeight: '700' },
  totalValue: { color: '#38BDF8', fontSize: 18, fontWeight: '800' },
  checkoutButton: { backgroundColor: '#16A34A', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  checkoutButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  statsGrid: { flexDirection: 'row', gap: 12, marginTop: 8 },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#38BDF8' },
  statLabel: { color: '#94A3B8', fontSize: 12, marginTop: 4 },
  courseStatRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  courseStatLabel: { color: '#E2E8F0', width: 90, fontSize: 13 },
  courseStatBarContainer: { flex: 1, height: 8, backgroundColor: '#1E293B', borderRadius: 4, overflow: 'hidden', marginHorizontal: 8 },
  courseStatBar: { height: '100%', backgroundColor: '#0EA5E9' },
  courseStatCount: { color: '#94A3B8', width: 50, fontSize: 12, textAlign: 'right' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', padding: 16 },
  modalContainer: { backgroundColor: '#1E293B', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#F8FAFC', marginBottom: 12 },
  errorBanner: { backgroundColor: '#991B1B', color: '#FECACA', padding: 8, borderRadius: 6, marginBottom: 12, fontSize: 12 },
  inputLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '600', marginBottom: 4, marginTop: 8 },
  modalInput: {
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalCoursePicker: { flexDirection: 'row', gap: 8, marginTop: 4 },
  pickerPill: { flex: 1, paddingVertical: 8, borderRadius: 6, backgroundColor: '#0F172A', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  activePickerPill: { backgroundColor: '#0284C7', borderColor: '#0284C7' },
  pickerPillText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  activePickerPillText: { color: '#FFFFFF' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelButton: { flex: 1, backgroundColor: '#334155', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  cancelButtonText: { color: '#E2E8F0', fontWeight: '600' },
  saveButton: { flex: 1, backgroundColor: '#0EA5E9', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  saveButtonText: { color: '#FFFFFF', fontWeight: '700' },
});