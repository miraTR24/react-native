import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Image, Button } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import { useSelector } from "react-redux";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ou une autre icône de votre choix
import { LinearGradient } from 'expo-linear-gradient';

const VendreSim = ({ navigation }) => {
  const [sim, setSim] = useState([]);
  const [idSim, setIdSim] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [ICCID, setICCID] = useState('');
  const [scannedICCID, setscannedICCID] = useState('');
  const [MSISDN, setMSISDN] = useState('');
  const [showSignButton, setShowSignButton] = useState(true);
  const [PI, setPI] = useState('');
  const [numPI, setnumPI] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [listeICCID, setListeICCID] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [adresse, setAdresse] = useState('');
  const [scanned, setScanned] = useState(false);
  const [numero, setNumero] = useState('');
  const [scanner, setScanner] = useState(false);
  const [signer, setSigner] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [scannedData, setScannedData] = useState('');
  
  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);



  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    setICCID(data);
    console.log('Type: ' + type + '\nData: ' + data)
  };

 
  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.1.71:3001/produit/cartesim');
      const json = await response.json();
      console.log('Response:', response);
      console.log('JSON:', json);
      setSim(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangesim = (value) => {
    setIdSim(value);
    console.log(idSim);
  };
  const handleChangeICCID = (value) => {
    if (value === "none") {
      setICCID("");
    } else {
      setICCID(value);
    }
    setScannedData(value);
  };

  const fetchSim = useCallback(async () => {
    try {
      const response = await fetch('http://192.168.1.71:3001/sim/detailSim/'+idSim);
      const json = await response.json();
      console.log('Response:', response);
      console.log('JSON:', json);
      setListeICCID(json);
      setIsDataAvailable(json.length > 0);
    } catch (err) {
      console.error(err);
    }
  }, [idSim]);

  useEffect(() => {
    fetchSim();
  }, [idSim, fetchSim]);




 

  // List of wilayas
  const wilayas = [
    "Adrar",
    "Chlef",
    "Laghouat",
    "Oum El Bouaghi",
    "Batna",
    "Béjaïa",
    "Biskra",
    "Béchar",
    "Blida",
    "Bouira",
    "Tamanrasset",
    "Tébessa",
    "Tlemcen",
    "Tiaret",
    "Tizi Ouzou",
    "Alger",
    "Djelfa",
    "Jijel",
    "Sétif",
    "Saïda",
    "Skikda",
    "Sidi Bel Abbès",
    "Annaba",
    "Guelma",
    "Constantine",
    "Médéa",
    "Mostaganem",
    "M'Sila",
    "Mascara",
    "Ouargla",
    "Oran",
    "El Bayadh",
    "Illizi",
    "Bordj Bou Arréridj",
    "Boumerdès",
    "El Tarf",
    "Tindouf",
    "Tissemsilt",
    "El Oued",
    "Khenchela",
    "Souk Ahras",
    "Tipaza",
    "Mila",
    "Aïn Defla",
    "Naâma",
    "Aïn Témouchent",
    "Ghardaïa",
    "Relizane",
  ];
  
// 385737
  return (
    <ScrollView showsVerticalScrollIndicator={false} automaticallyAdjustKeyboardInsets={true}>
      <LinearGradient colors={['#ffffff' , '#6EAC40']} style={{ flex: 1, width: '100%',borderRadius: 8}} >
     <View style={styles.BigContainer}>
      <View style={styles.bar}>
        <Text style={{ paddingBottom: 10, paddingTop: 15, fontSize: 20, fontWeight: 'bold',textAlign: 'center', }}>Vendre une carte SIM </Text>
        <Text style={{ paddingBottom: 0, paddingTop: 15, fontSize: 18,fontStyle: 'italic'  }}>Veuillez intorduire les informations du client avant de poursuivre:</Text>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.inputForm}
          placeholder="Nom"
          value={nom}
          onChangeText={(text) => setNom(text)}
        />
        <TextInput
          style={styles.inputForm}
          placeholder="Prénom"
          value={prenom}
          onChangeText={(text) => setPrenom(text)}
        />

        <TextInput
          style={styles.inputForm}
          onChangeText={setNumero}
          value={numero}
          placeholder="Numéro"
        />
        

        <TextInput
          style={styles.inputForm}
          placeholder="Adresse"
          value={adresse}
          onChangeText={(text) => setAdresse(text)}
          multiline
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={wilaya}
            onValueChange={(itemValue) => setWilaya(itemValue)}
          >
            {wilayas.map((wilaya, index) => (
              <Picker.Item key={index} label={wilaya} value={wilaya} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
          selectedValue={idSim || 'none'} // Add a default value in case idSim is undefined
            onValueChange={handleChangesim}
            style={{ color:'gray' }}
          >
  {/* Placeholder */}
         <Picker.Item label="Sélectionnez un type de SIM" value="none" style={{ color:'gray' }} />
         {sim.map((item) => (
        <Picker.Item
        key={item.nomProduit}
        label={item.nomProduit}
        value={item.nomProduit}
        />
        ))}
        </Picker> 
       </View>

       
 <View style={styles.IccidPickerContainer}>
  <Picker
    selectedValue={ICCID}
    onValueChange={handleChangeICCID}
  >
    <Picker.Item label="Sélectionner un ICCID" value="none" style={{ color:'gray' }}/>
    {scannedData !== '' && (
      <Picker.Item label={scannedData} value={scannedData} />
    )}

    {listeICCID.flatMap((item) => item.StockSims).map((sim) => (
      <Picker.Item
        key={sim?.num_serie}
        label={sim?.num_serie}
        value={sim?.num_serie}
      />
    ))}
  </Picker>
  <TouchableOpacity
  style={styles.cameraIconContainer}
  onPress={() => { scanner ?  setScanner(false): setScanner(true)
  }}
>
    <Icon name="camera" size={20} color="#000" />
  </TouchableOpacity>
</View>

   {scanner &&
   <>
        <View style={styles.scanContainer} >
        <View style={styles.barcodebox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 400, width: 400 }} />
        </View>
        </View>
  
        {scanned &&
        <>
         <View style={styles.ButtonContainer}>
          <TouchableOpacity
              style={styles.button}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.buttonTextScan}>Scanner encore?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setScanner(false)} 
            >
              <Text style={styles.buttonTextScan}>ok</Text>
            </TouchableOpacity>
            </View>
         </>}
         </>}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={PI}
            onValueChange={(itemValue) => setPI(itemValue)}
           
          >
            <Picker.Item label="Selectionner un type PI" style={{ color:'gray' }} />

            <Picker.Item label="Carte d'identité" value="carte_identite" />
            <Picker.Item label="Permis de conduire" value="permis_conduire" />
          
          </Picker>
          
        </View>
        <TextInput
        style={styles.inputForm}
        placeholder="Num PI"
        value={numPI}
        onChangeText={(text) => setnumPI(text)}
      />
        <DatePicker
          style={styles.dateInputContainer}
          date={selectedDate}
          mode="date"
          placeholder="Date de naissance"
          format="YYYY-MM-DD"
          minDate="1900-01-01"
          maxDate="2050-12-31"
          confirmBtnText="Confirmer"
          cancelBtnText="Annuler"
          customStyles={{
            dateInput: styles.dateInput,
            placeholderText: styles.datePlaceholderText,
            dateText: styles.dateText,
            dateIcon: styles.icon,
            btnTextConfirm: styles.dateConfirmText,
            btnTextCancel: styles.dateCancelText,
          }}
          onDateChange={(date) => setSelectedDate(date)}
          
        />
         <TextInput
        placeholder="MSISDN"
        value={MSISDN}
        editable={false}
        style={styles.inputForm}
        onChangeText={(text) => setMSISDN(text)}
      />

        <TouchableOpacity
              style={styles.submitButton}
              onPress={() => { navigation.navigate('SignScreen', {  nom, prenom, wilaya , adresse})}} 
            >
              <Text style={styles.buttonText}>Signer</Text>
            </TouchableOpacity>
      </View>
      </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop:5,
    backgroundColor: '#385737',
    padding: 10,
    borderRadius: 5,
    width :150,
  },
  buttonTextScan: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bar: { 
   // backgroundColor: '#6EAC40', 
    padding: 3, 

  },
  inputForm: {
    borderColor: 'gray',
    borderWidth: 1,
    height:55,
    borderRadius: 12,
    //marginTop: 20,
    padding: 8,
    marginVertical: 8,
    width: "100%",
  },
  container: {
      padding:20,
      height:"100%",
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 16,
     // backgroundColor:'#6EAC40',
    },
    BigContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingHorizontal: 16,

    //  height:1500
    },
    maintext: {
      fontSize: 16,
      margin: 20,
    },
    barcodebox: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 300,
      width: 310,
      overflow: 'hidden',
      borderRadius: 30,
      backgroundColor: '#385737'
    },
    scanContainer:{alignItems: 'center'},
  submitButton: {
    height:60,
    marginTop: 15,
    marginBottom: 60,
    borderRadius: 24,
    backgroundColor: '#385737',
  },
  buttonText: {
    paddingTop : 20,
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    borderColor: 'gray',
    height:55,
    borderRadius: 12,
    marginVertical: 8,
  },
  IccidPickerContainer: {
    width: '100%',
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    borderColor: 'gray',
    height:55,
    borderRadius: 12,
    marginVertical: 8,
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 13,
    top: 14,
    zIndex: 1,
  },
  dateInputContainer: {
    width: '100%',
    borderWidth: 1,
    marginTop:15,
    borderColor: 'gray',
    height:55,
    borderRadius: 12,
    marginVertical: 8,
    
   
  },
  dateInput: {
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 0,
    marginTop:12,
    color:'gray'
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: '#385737'
  },
  scannerButton: {
    alignSelf: 'flex-end', // Aligne le bouton "Scanner" à droite
    marginTop: 10,
  },
});

export default VendreSim;