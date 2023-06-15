function decrypt() {
  var passwordFile = document.getElementById("passwordFile");
  var passwordList = [];
  var reader = new FileReader();
  reader.onload = function(event) {
    var data = event.target.result;
    var lines = data.split('\n');
    for (var i = 0; i < lines.length; i++) {
      passwordList.push(lines[i]);
    }
  };
  reader.readAsText(passwordFile.files[0]);

  for (var i = 0; i < passwordList.length; i++) {
    var password = passwordList[i];
    var result = decryptVault(password);
    if (result) {
      document.getElementById("output").innerHTML = result;
      return;
    }
  }

  document.getElementById("output").innerHTML = "No passwords found";
}

function addButton() {
  var button = document.createElement("button");
  button.innerHTML = "Export to CSV";
  button.onclick = function() {
    var vaultData = decryptVault();
    var csvData = vaultData.join(",");
    var csvFile = new File([csvData], "vault.csv");
    csvFile.save();
  };
  document.body.appendChild(button);
}

function addOptions() {
  var options = document.createElement("select");
  var option1 = document.createElement("option");
  option1.innerHTML = "Option 1";
  options.appendChild(option1);
  var option2 = document.createElement("option");
  option2.innerHTML = "Option 2";
  options.appendChild(option2);
  var option3 = document.createElement("option");
  option3.innerHTML = "Option 3";
  options.appendChild(option3);
  document.body.appendChild(options);
}

window.onload = function() {
  addButton();
  addOptions();
};

function decryptVault(password) {
  var vault = new MetaMaskVault();
  vault.decrypt(password);
  return vault.contents;
}